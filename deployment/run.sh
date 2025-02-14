#!/bin/sh

echo "Regenerate Application Configuration v1"


for f in /app/build/static/js/*.js; do
    envsub --syntax handlebars "$f"
done

mkdir -p build/static-chatapp-ui
cp -r build/static build/static-chatapp-ui
cp -r build/logo.png build/static-chatapp-ui
cp -r build/robots.txt build/static-chatapp-ui
cp -r build/service-worker.js build/static-chatapp-ui
cp -r build/manifest.json build/static-chatapp-ui
cp -r build/favicon.ico build/static-chatapp-ui
cp -r build/font build/static-chatapp-ui

echo "Starting nginx..."
nginx -t
nginx -g "daemon off;"
echo "Webapp started"