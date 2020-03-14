FROM node:8-alpine as build-stage
WORKDIR /app
RUN npm install -g yarn
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
