#!/bin/sh

for envfile in .env .env.local .env.production .env.production.local; do
  if [ -f "/usr/local/etc/kippenstummel/web/$envfile" ]; then
    ln -sf "/usr/local/etc/kippenstummel/web/$envfile" "/usr/local/bin/kippenstummel/web/$envfile"
  fi
done

exec node server.js
