# docker file, tells docker to containerize the environment variables and 

# using node 16 alpine
FROM node:16-alpine
# following linux convention
WORKDIR /usr/src/app
# copy package and package-lock json
COPY package*.json ./
# install dependencies based on package json
RUN npm install
# copy env variables
COPY .env .
# copy js file
COPY index.js .

# run the send command (fire and forget) -- just realized that it's bad
# need to change it into something else that only fires when the microservice is called
RUN npm run send