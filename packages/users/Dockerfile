FROM node:12

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig.json ./

COPY ./packages/common ./packages/common
COPY ./packages/users ./packages/users

COPY yarn.lock .

WORKDIR ./packages/users
RUN yarn 
RUN yarn build
