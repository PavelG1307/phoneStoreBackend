FROM node:14.21.2
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node", "run", "build"]