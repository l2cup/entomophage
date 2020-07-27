FROM node:12

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig.json ./

COPY ./packages/common ./packages/common
COPY ./packages/gateway ./packages/gateway

COPY yarn.lock .

WORKDIR ./packages/gateway
RUN yarn 
RUN yarn build
