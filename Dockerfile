FROM node:20.16.0

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x /app/wait-for-it.sh

ENV IS_DOCKER=mysql

EXPOSE 3000
