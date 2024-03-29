FROM node:16.3.0-alpine@sha256:f5079a4f93c8e4fd07ffa93fc95f6484d7f4f40abd126c11810cb282483ab599
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package*.json .env src/amqp/js/consumer_setup.js src/amqp/js/amqp_worker.js ./
RUN npm ci --only=production
USER node
COPY --chown=node:node package*.json .env src/amqp/js/consumer_setup.js src/amqp/js/amqp_worker.js ./
CMD ["node", "amqp_worker.js"]