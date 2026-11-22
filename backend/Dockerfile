FROM php:8.3-apache
RUN docker-php-ext-install pdo_mysql
RUN a2enmod rewrite
COPY apache-site.conf /etc/apache2/conf-available/razem-site.conf
RUN a2enconf razem-site
