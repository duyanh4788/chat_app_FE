FROM node:20 as react_build_base

WORKDIR /app

COPY . .

RUN npm install 

RUN npm run build 

FROM nginx:1.17.9-alpine

WORKDIR /app

RUN apk --no-cache add gettext curl

COPY --from=react_build_base /app/build /app/build

COPY run.sh /app
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN chmod +x /app/run.sh && \
    mkdir -p /etc/nginx/logs/ && \
    touch /etc/nginx/logs/static.log

RUN nginx -t

CMD ["/bin/sh", "-c", "/app/run.sh"]
