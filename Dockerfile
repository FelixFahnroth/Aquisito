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
    # Clean URLs: Versucht erst Datei, dann .html-Endung, dann Ordner \
    location / { \
        try_files $uri $uri.html $uri/ =404; \
    } \
    \
    # Caching für Assets (Bilder, CSS, JS, Fonts) \
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?)$ { \
        expires 7d; \
        add_header Cache-Control "public, no-transform"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# ==========================================
# 3. Statische Webdateien kopieren
# ==========================================
COPY . /usr/share/nginx/html

# Port 80 freigeben
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
