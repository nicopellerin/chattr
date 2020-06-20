FROM mhart/alpine-node

WORKDIR /app
COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000:3000

CMD ["yarn", "start"]