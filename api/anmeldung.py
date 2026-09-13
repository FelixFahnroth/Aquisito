#!/usr/bin/env python3
"""anmeldung.py — nimmt das Freiwilligen-Formular entgegen und schickt es per
E-Mail an den Verein.

Bewusst ohne Abhängigkeiten: nur die Python-Standardbibliothek. Der Dienst
speichert nichts. Er nimmt den POST entgegen, baut daraus eine Mail und gibt
die Verbindung wieder frei — es gibt keine Datenbank und keine Logdatei mit
Formularinhalten. Das ist der Grund, warum die Datenschutzerklärung weiterhin
sagen kann, dass die Angaben nur zur Beantwortung verarbeitet werden.

Konfiguration ausschließlich über Umgebungsvariablen, siehe .env.example.
Es steht kein Passwort in dieser Datei und es gehört auch keins hierhin.
"""

import json
import os
import re
import smtplib
import sys
import threading
import time
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs

# ---------------------------------------------------------------------------
# Konfiguration
# ---------------------------------------------------------------------------

LISTEN_PORT = int(os.environ.get("PORT", "8080"))

SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")


def _read_password() -> str:
    """Passwort entweder direkt aus SMTP_PASSWORD oder aus einer Datei, auf die
    SMTP_PASSWORD_FILE zeigt.

    Die Datei-Variante ist die bessere: damit lässt sich ein Docker-Secret oder
    eine Datei mit 600-Rechten nutzen, und das Passwort taucht dann weder in
    'docker inspect' noch in der Prozess-Umgebung auf."""
    path = os.environ.get("SMTP_PASSWORD_FILE", "")
    if path:
        try:
            with open(path, encoding="utf-8") as fh:
                return fh.read().strip()
        except OSError as exc:
            sys.stderr.write(f"SMTP_PASSWORD_FILE nicht lesbar: {exc}\n")
            return ""
    return os.environ.get("SMTP_PASSWORD", "")


SMTP_PASSWORD = _read_password()
# Absender. Die meisten Mailserver erlauben nur die Adresse, mit der man sich
# auch angemeldet hat — im Zweifel also dieselbe wie SMTP_USER. Eine fremde
# Adresse wird entweder abgelehnt oder scheitert später an SPF/DKIM.
MAIL_FROM = os.environ.get("MAIL_FROM", "info@aquisito.de")
MAIL_TO = os.environ.get("MAIL_TO", "info@aquisito.de")
SUCCESS_URL = os.environ.get("SUCCESS_URL", "/anfrage-gesendet")
ERROR_URL = os.environ.get("ERROR_URL", "/freiwillige?fehler=1#anmeldung")

MAX_BODY = 64 * 1024          # ein Formular ist nie groß; alles darüber ist Unfug
RATE_LIMIT_SECONDS = 20       # pro IP, gegen versehentliche Doppelklicks und Bots

# Reihenfolge bestimmt, wie die Mail aussieht.
FIELDS = [
    ("name", "Name"),
    ("email", "E-Mail"),
    ("telefon", "Telefon"),
    ("interesse", "Interesse"),
    ("zeitraum", "Zeitraum"),
    ("nachricht", "Nachricht"),
]
REQUIRED = ("name", "email", "einwilligung")

_last_seen = {}
_lock = threading.Lock()


def _rate_limited(ip: str) -> bool:
    now = time.monotonic()
    with _lock:
        for key, seen in list(_last_seen.items()):
            if now - seen > 3600:
                del _last_seen[key]
        if ip in _last_seen and now - _last_seen[ip] < RATE_LIMIT_SECONDS:
            return True
        _last_seen[ip] = now
    return False


def _header_safe(value: str) -> str:
    """Zeilenumbrüche aus allem entfernen, was in einen Mail-Header wandert —
    sonst kann ein Formularfeld zusätzliche Header einschleusen."""
    return re.sub(r"[\r\n]+", " ", value).strip()


def _build_message(data: dict) -> EmailMessage:
    lines = ["Neue Anfrage über das Formular auf aquisito.de/freiwillige", ""]
    for key, label in FIELDS:
        values = data.get(key, [])
        value = ", ".join(v.strip() for v in values if v.strip())
        lines.append(f"{label}: {value or '—'}")
    lines += [
        "",
        "Einwilligung in die Datenverarbeitung: ja (Pflichtfeld im Formular)",
    ]

    msg = EmailMessage()
    name = _header_safe(data.get("name", [""])[0])
    reply_to = _header_safe(data.get("email", [""])[0])

    msg["Subject"] = f"Anfrage Freiwilligendienst: {name}" if name else "Anfrage Freiwilligendienst"
    msg["From"] = MAIL_FROM
    msg["To"] = MAIL_TO
    # Antworten geht direkt an die anfragende Person.
    if "@" in reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content("\n".join(lines))
    return msg


def _send(msg: EmailMessage) -> None:
    if not SMTP_HOST:
        raise RuntimeError("SMTP_HOST ist nicht gesetzt")

    if SMTP_PORT == 465:
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=20)
        encrypted = True
    else:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20)
        encrypted = False

    try:
        if not encrypted:
            try:
                server.starttls()
                encrypted = True
            except smtplib.SMTPNotSupportedError:
                # Ein Relay ohne TLS ist nur vertretbar, solange dabei kein
                # Passwort über die Leitung geht — siehe unten.
                pass

        if SMTP_USER:
            if not encrypted:
                raise RuntimeError(
                    f"{SMTP_HOST}:{SMTP_PORT} bietet kein STARTTLS an. "
                    "Mit gesetztem SMTP_USER wird nicht gesendet, sonst ginge "
                    "das Passwort im Klartext über die Leitung. Nutzt Port 587 "
                    "oder 465."
                )
            server.login(SMTP_USER, SMTP_PASSWORD)

        server.send_message(msg)
    finally:
        try:
            server.quit()
        except Exception:
            pass


class Handler(BaseHTTPRequestHandler):
    server_version = "aquisito-anmeldung"

    def log_message(self, fmt, *args):
        """Standard-Log, aber niemals der Request-Body — da stehen personen-
        bezogene Daten drin."""
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    # -- Antworten ----------------------------------------------------------

    def _wants_json(self) -> bool:
        return "application/json" in (self.headers.get("Accept") or "")

    def _respond(self, status: int, ok: bool, message: str, redirect: str):
        if self._wants_json():
            body = json.dumps({"ok": ok, "message": message}).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            # Ohne JavaScript: normale Weiterleitung. 303, damit ein Reload
            # nicht erneut absendet.
            self.send_response(303)
            self.send_header("Location", redirect)
            self.send_header("Content-Length", "0")
            self.end_headers()

    def _ok(self):
        self._respond(200, True, "Danke, deine Anfrage ist angekommen.", SUCCESS_URL)

    def _fail(self, status: int, message: str):
        self._respond(status, False, message, ERROR_URL)

    # -- Routen -------------------------------------------------------------

    def do_GET(self):
        if self.path.rstrip("/") == "/healthz":
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", "2")
            self.end_headers()
            self.wfile.write(b"ok")
        else:
            self.send_error(404)

    def do_POST(self):
        if self.path.split("?")[0].rstrip("/") not in ("/api/anmeldung", "/anmeldung"):
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            self._fail(400, "Die Anfrage war leer oder zu groß.")
            return

        raw = self.rfile.read(length).decode("utf-8", "replace")
        data = parse_qs(raw, keep_blank_values=True)

        # Honeypot: gefülltes Feld heißt Bot. Nach außen sieht das wie Erfolg
        # aus, damit der Bot nichts dazulernt.
        if any(v.strip() for v in data.get("website", [])):
            self._ok()
            return

        missing = [f for f in REQUIRED if not any(v.strip() for v in data.get(f, []))]
        if missing:
            self._fail(400, "Bitte fülle Name, E-Mail und die Einwilligung aus.")
            return

        ip = self.headers.get("X-Forwarded-For", self.client_address[0]).split(",")[0].strip()
        if _rate_limited(ip):
            self._fail(429, "Einen Moment bitte — die Anfrage war schon unterwegs.")
            return

        try:
            _send(_build_message(data))
        except Exception as exc:                     # noqa: BLE001
            # Fehlertext nur ins Log, nie in die Antwort.
            sys.stderr.write(f"SMTP-Fehler: {type(exc).__name__}: {exc}\n")
            self._fail(502, "Das Versenden hat gerade nicht geklappt. "
                            "Schreib uns bitte direkt an info@aquisito.de.")
            return

        self._ok()


def selftest() -> int:
    """Prüft die Zugangsdaten und schickt eine Testmail an MAIL_TO.

        docker compose exec anmeldung python /app/anmeldung.py --selftest

    Gibt niemals das Passwort aus, nur ob es funktioniert hat."""
    print("Konfiguration:")
    print(f"  SMTP_HOST     {SMTP_HOST or '(leer!)'}")
    print(f"  SMTP_PORT     {SMTP_PORT}")
    print(f"  SMTP_USER     {SMTP_USER or '(leer — ohne Anmeldung)'}")
    print(f"  SMTP_PASSWORD {'gesetzt (%d Zeichen)' % len(SMTP_PASSWORD) if SMTP_PASSWORD else '(leer!)'}")
    print(f"  MAIL_FROM     {MAIL_FROM}")
    print(f"  MAIL_TO       {MAIL_TO}")
    print()

    if not SMTP_HOST:
        print("FEHLER: SMTP_HOST ist leer. Die .env wird nicht gelesen oder ist leer.")
        return 2
    if SMTP_USER and MAIL_FROM.lower() != SMTP_USER.lower():
        print(f"Hinweis: MAIL_FROM ({MAIL_FROM}) und SMTP_USER ({SMTP_USER}) sind "
              "verschieden. Viele Anbieter lehnen das ab. Wenn es gleich unten "
              "scheitert, setzt beides auf dieselbe Adresse.")
        print()

    msg = EmailMessage()
    msg["Subject"] = "Testmail vom Anmeldeformular"
    msg["From"] = MAIL_FROM
    msg["To"] = MAIL_TO
    msg.set_content(
        "Das ist eine Testmail von api/anmeldung.py.\n"
        "Wenn sie angekommen ist, funktioniert das Formular auf "
        "aquisito.de/freiwillige.\n"
    )

    try:
        _send(msg)
    except Exception as exc:                         # noqa: BLE001
        print(f"FEHLGESCHLAGEN: {type(exc).__name__}: {exc}")
        print()
        name = type(exc).__name__
        if name == "SMTPAuthenticationError":
            print("Der Server hat Benutzer oder Passwort abgelehnt. Falls euer "
                  "Anbieter App-Passwörter kennt, nehmt eins davon.")
        elif name in ("SMTPConnectError", "TimeoutError", "OSError", "gaierror"):
            print("Keine Verbindung. Stimmen SMTP_HOST und SMTP_PORT? "
                  "Üblich sind 587 (STARTTLS) und 465 (SSL).")
        elif name == "SMTPSenderRefused":
            print("Der Server akzeptiert MAIL_FROM nicht als Absender. "
                  "Setzt MAIL_FROM auf dieselbe Adresse wie SMTP_USER.")
        elif name == "SMTPRecipientsRefused":
            print(f"Der Server nimmt {MAIL_TO} nicht als Empfänger an.")
        return 1

    print(f"OK — Testmail an {MAIL_TO} verschickt. Schaut ins Postfach.")
    return 0


def main():
    if "--selftest" in sys.argv:
        sys.exit(selftest())

    missing = [k for k in ("SMTP_HOST", "MAIL_FROM", "MAIL_TO") if not os.environ.get(k)]
    if missing:
        sys.stderr.write(
            "Warnung: %s nicht gesetzt — Absenden wird fehlschlagen. "
            "Siehe .env.example und 'python /app/anmeldung.py --selftest'.\n"
            % ", ".join(missing)
        )
    srv = ThreadingHTTPServer(("0.0.0.0", LISTEN_PORT), Handler)
    sys.stderr.write(f"anmeldung: hört auf Port {LISTEN_PORT}, Ziel {MAIL_TO}\n")
    srv.serve_forever()


if __name__ == "__main__":
    main()
