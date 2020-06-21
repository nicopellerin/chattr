FROM node

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["yarn", "start"]