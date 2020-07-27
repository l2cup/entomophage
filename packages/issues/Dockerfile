FROM node:12

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig.json ./

COPY ./packages/common ./packages/common
COPY ./packages/issues ./packages/issues

COPY yarn.lock .

WORKDIR ./packages/issues
RUN yarn 
RUN yarn build
