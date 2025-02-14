FROM node:20 AS react_build_base

WORKDIR /app

COPY package.json . 
COPY . .

COPY ./public /app/public
COPY deployment/env.tmpl.js src/config/index.ts

RUN npm install
RUN npm run build

FROM nginx:1.17.9-alpine

WORKDIR /app

RUN apk add --no-cache nodejs npm && npm install -g envsub

COPY --from=react_build_base /app/build /app/build
COPY deployment/run.sh /app
COPY deployment/nginx/nginx.conf /etc/nginx/nginx.conf
COPY deployment/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN chmod +x /app/run.sh && \
    mkdir -p /etc/nginx/logs/ && \
    touch /etc/nginx/logs/static.log

CMD ["/bin/sh", "-c", "/app/run.sh"]
