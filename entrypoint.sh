#!/bin/bash

DOMAIN="birthday.bryars.com"
EMAIL="bryars@hotmail.com"

# Replace DOMAIN placeholder in nginx config
sed -i "s/DOMAIN/$DOMAIN/g" /etc/nginx/conf.d/default.conf

# Check if certificates exist
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "No certificates found. Getting new ones..."

    # Start nginx temporarily for ACME challenge
    nginx &
    sleep 2

    # Get certificate
    certbot certonly --webroot -w /usr/share/nginx/html \
        -d $DOMAIN \
        --email $EMAIL \
        --agree-tos \
        --non-interactive

    # Stop temporary nginx
    nginx -s stop
    sleep 2
fi

# Start certificate renewal in background (checks twice daily)
while :; do
    sleep 12h
    certbot renew --quiet
    nginx -s reload
done &

# Start nginx
exec nginx -g "daemon off;"
