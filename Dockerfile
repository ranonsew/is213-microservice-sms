# docker file time
# need to edit a bit for the production versions
# need to include a "RUN npm ci --only=production"

# using node 16 alpine
FROM node:16-alpine
# following linux convention
WORKDIR /usr/src/app
# copy package and package-lock json
COPY package*.json ./
# install dependencies based on package json
RUN npm install
# copy env variables
COPY .env server.js index.js ./
# bundling important js files, excluding ts and config files
# COPY server.js .
# COPY index.js .
# expose port
EXPOSE 3002

# run the send command (fire and forget) -- just realized that it's bad
# need to change it into something else that only fires when the microservice is called
# RUN npm run server
CMD ["node", "server.js"]