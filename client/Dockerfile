FROM node:alpine

WORKDIR /client
RUN npm install -g @angular/cli
COPY ./package.json .
RUN npm install
COPY . .
RUN npm rebuild node-sass
CMD ["npm", "start"]