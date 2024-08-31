FROM node:20.6.0

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY src/ ./src
COPY .env ./
COPY .env.example ./

CMD [ "npm", "run", "start" ]
