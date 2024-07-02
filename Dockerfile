FROM node:lts-alpine as build
WORKDIR /1biot/pioneer-3
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:stable-alpine as prod
COPY --from=build /1biot/pioneer-3/dist /usr/share/nginx/html
EXPOSE 80
