FROM node:20 as build

ENV API_MAIN=API_MAIN
ENV API_PEDIDOS=API_PEDIDOS

WORKDIR /main
COPY package*.json .
RUN npm install
COPY . .
RUN npm install @angular/cli -g
RUN ng build

# Etapa 2: Configuração do Nginx para servir a aplicação
FROM nginx:alpine

COPY --from=build /main/dist/joliny-admin/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5050

CMD ["nginx", "-g", "daemon off;"]