FROM node:14.15.4 as node

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build --prod

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

COPY --from=node /app/dist/digiteyes /usr/share/nginx/html
