FROM node:8-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
CMD yarn run dev
