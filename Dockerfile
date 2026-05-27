FROM php:8.2-apache

# Installiere die für das ZIP-Modul benötigten System-Bibliotheken
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    && docker-php-ext-install zip

# Aktiviere das Apache Rewrite-Modul
RUN a2enmod rewrite

WORKDIR /var/www/html

# Kopiere die Dateien aus dem Repo (deine archivarix.cms.php)
COPY . /var/www/html/

# Setze die Rechte, damit das CMS Dateien erstellen und herunterladen darf
RUN chown -R www-data:www-data /var/www/html
