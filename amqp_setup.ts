// rabbitmq-mgmt container id: 0c476c4886f8
// localhost:15672 -- rabbitmq

import amqp from "amqplib";
// const open = amqp.connect("amqp://localhost:5672");
// const conn = amqp.connect({
//   protocol: 'amqp',
//   hostname: 'localhost',
//   port: 5672,
//   locale: 'en_US',
//   heartbeat: 3600
// });
const exchange = { name: 'message_topic', type: 'topic' };
const options = { durable: true };
const queue = { name: 'Twilio-Sms', key: '*.notification' };

// conn.then((connection) => connection.createChannel())
//   .then((channel) => {
//     channel.assertExchange(exchange.name, exchange.type, options);
//     channel.assertQueue(queue.name, options);
//     channel.bindQueue(queue.name, exchange.name, queue.key);
//   })
//   .catch(err => { throw err });

async function openChannel() {
  const connection = await amqp.connect({
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    locale: 'en_US',
    heartbeat: 3600
  });
  const channel = await connection.createChannel();
  return { channel, connection };
};

function closeCh(ch: amqp.Channel, conn: amqp.Connection) {
  setTimeout(() => {
    ch.close();
    conn.close();
  }, 500);
};

// server.ts
const send = async () => {
  const { channel, connection } = await openChannel();
  await channel.assertExchange(exchange.name, exchange.type, options);
  await channel.assertQueue(queue.name, options);
  await channel.bindQueue(queue.name, exchange.name, queue.key);
  await channel.publish(exchange.name, queue.key, Buffer.from(""));
  closeCh(channel, connection);
};

// index.ts
const receive = async () => {};

export { exchange, options, queue, send, receive };