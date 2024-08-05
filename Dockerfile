FROM node:20

ENV API_MAIN=API_MAIN
ENV API_PEDIDOS=API_PEDIDOS

WORKDIR /main

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5050

CMD ["npm","start"]