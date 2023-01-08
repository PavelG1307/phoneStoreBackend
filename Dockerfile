FROM node:14.21.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "run", "build"]

RUN npm start