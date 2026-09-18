# ==========================================
# 1. Basis-Image: Nginx Alpine (sehr klein & schnell)
# ==========================================
FROM nginx:alpine

# ==========================================
# 2. Nginx-Konfiguration direkt erstellen
# ==========================================
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    charset utf-8; \
    \
    # Kein Zugriffsprotokoll. Die Website misst nichts, wertet nichts aus und \
    # braucht die Daten fuer nichts — dann ist es ehrlicher, die IP-Adressen \
    # der Besucherinnen gar nicht erst aufzuschreiben, statt eine Loeschfrist \
    # zu versprechen, die niemand kontrolliert. Siehe datenschutz.html. \
    # error_log bleibt an: der protokolliert keine normalen Aufrufe, sondern \
    # nur echte Fehler, und ohne ihn ist eine Stoerung nicht zu finden. \
    access_log off; \
    \
    # Gzip-Komprimierung aktivieren \
    gzip on; \
    gzip_types text/plain text/css application/javascript application/json image/svg+xml; \
    \
    # 301-Redirect für den QR-Code auf gedruckten Flyern \
    location = /landing { \
        return 301 /; \
    } \
    location = /landing.html { \
        return 301 /; \
    } \
    \
    # Routing für die Danke-Seite nach einer Spende \
    location = /spenden/danke { \
        try_files /danke.html =404; \
    } \
    \
    # Danke-Seite nach einer Kochbuch-Bestellung (PayPal return-URL) \
    location = /kochbuch/danke { \
        try_files /kochbuch-danke.html =404; \
    } \
    \
    # Clean URLs: Versucht erst Datei, dann .html-Endung, dann Ordner \
    location / { \
        try_files $uri $uri.html $uri/ =404; \
    } \
    \
    # Caching für Bilder und Fonts: Dateinamen aendern sich, wenn der Inhalt \
    # sich aendert, also darf lange gecacht werden. \
    location ~* \.(png|jpg|jpeg|gif|ico|svg|woff2?)$ { \
        expires 7d; \
        add_header Cache-Control "public, no-transform"; \
    } \
    \
    # CSS und JS behalten ihren Dateinamen. Mit "expires 7d" haben Besucher \
    # nach einem Redesign bis zu sieben Tage lang altes CSS zum neuen HTML \
    # bekommen. Deshalb: immer revalidieren. Unveraendert kostet das nur ein \
    # 304, und ein Cache-Bust kann nie wieder vergessen werden. \
    location ~* \.(css|js)$ { \
        add_header Cache-Control "public, no-cache, must-revalidate"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# ==========================================
# 3. Statische Webdateien kopieren
# ==========================================
COPY . /usr/share/nginx/html

# Port 80 freigeben
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
