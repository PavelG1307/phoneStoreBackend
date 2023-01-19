FROM node:14.21.2
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
RUN npm build
COPY . .
EXPOSE 3000
CMD ["npm", "start"]