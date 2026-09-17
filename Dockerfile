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
    # Das Freiwilligen-Formular. Der Weiterleiter laeuft als eigener Dienst \
    # im internen Netz (siehe docker-compose.yml) und ist von aussen nur \
    # ueber genau diesen Pfad erreichbar. \
    # \
    # Der Name steht bewusst in einer Variablen. Bei einem festen Namen im \
    # proxy_pass loest nginx ihn schon beim Start auf und verweigert den \
    # Dienst komplett, wenn es den Container gerade nicht gibt ("host not \
    # found in upstream") — dann steht die ganze Website, nicht nur das \
    # Formular. Mit Variable plus resolver wird erst pro Anfrage aufgeloest: \
    # nginx startet immer, und faellt der Weiterleiter aus, betrifft das nur \
    # diesen einen Pfad. 127.0.0.11 ist der DNS von Docker. \
    location = /api/anmeldung { \
        resolver 127.0.0.11 ipv6=off valid=10s; \
        # Ohne das wartet nginx im Fehlerfall 30 Sekunden auf die \
        # Namensaufloesung, und der Absende-Klick haengt so lange. \
        resolver_timeout 5s; \
        set $upstream_anmeldung anmeldung:8080; \
        proxy_pass http://$upstream_anmeldung; \
        proxy_set_header Host $host; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        proxy_connect_timeout 5s; \
        proxy_read_timeout 30s; \
        client_max_body_size 64k; \
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
