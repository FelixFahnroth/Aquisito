FROM php:8.2-apache

# Aktiviere das Rewrite-Modul für das Archivarix-Routing
RUN a2enmod rewrite

# Setze das Arbeitsverzeichnis
WORKDIR /var/www/html

# Kopiere alle deine Repo-Dateien in den Web-Ordner des Containers
COPY . /var/www/html/

# Erstelle automatisch die nötigen Routing-Regeln (ersetzt die nginx.conf)
RUN echo "RewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ /index.php?\$1 [L,QSA]" > .htaccess

# Setze die korrekten Berechtigungen für den Webserver
RUN chown -R www-data:www-data /var/www/html
