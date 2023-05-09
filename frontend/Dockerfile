FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

# RUN yarn build

EXPOSE 3000

# CMD ["npm", "start"]

CMD ["yarn", "dev", "--port", "3000", "--host", "0.0.0.0"]