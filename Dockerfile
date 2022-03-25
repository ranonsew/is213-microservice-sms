# docker file time
# need to edit a bit for the production versions
# need to include a "RUN npm ci --only=production"

# this docker file is for the http version of the twilio sms microservice

# using node 16 alpine
FROM node:16.3.0-alpine@sha256:f5079a4f93c8e4fd07ffa93fc95f6484d7f4f40abd126c11810cb282483ab599
ENV NODE_ENV production
WORKDIR /usr/src/app
# copy necessary package json and files
COPY package*.json .env server.js index.js ./
# install dependencies based on package json
RUN npm ci --only=production
# set running privileges
USER node
COPY --chown=node:node package*.json .env server.js index.js ./
# expose port
EXPOSE 3002

# run the send command (fire and forget) -- just realized that it's bad
# need to change it into something else that only fires when the microservice is called
# RUN npm run server
CMD ["node", "server.js"]