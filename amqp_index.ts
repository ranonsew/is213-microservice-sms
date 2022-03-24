// rabbitmq-mgmt container id: 0c476c4886f8
// localhost:15672 -- rabbitmq

import amqp from "amqplib";

// necessary variables
const exchange = { name: 'message_topic', type: 'topic' };
const options = { durable: true };
const queue = { name: 'Twilio-Sms', key: '*.notification' };

// open connection to rabbitmq
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

// close connection to rabbitmq
function closeCh(ch: amqp.Channel, conn: amqp.Connection) {
  setTimeout(() => {
    ch.close();
    conn.close();
  }, 500);
};

// sending over amqp
const send = async (jsonData: string) => {
  const { channel, connection } = await openChannel();
  await channel.assertExchange(exchange.name, exchange.type, options);
  await channel.assertQueue(queue.name, options);
  await channel.bindQueue(queue.name, exchange.name, queue.key);
  await channel.publish(exchange.name, queue.key, Buffer.from(jsonData));
  closeCh(channel, connection);
};

// receiving over amqp
const receive = async () => {
  const { channel, connection } = await openChannel();
  await channel.assertQueue(queue.name, options);
  await channel.consume(queue.name, msg => {
    if (!msg) return; // if null then don't send anything
    const jsonData = msg.content.toString(); // storing first for some other use?
      // TODO: access twilio sending function
    console.log(jsonData); // console log string first, idk what to do
    channel.ack(msg); // acknowledge the message
    channel.cancel('myconsumer');
  }, { consumerTag: 'myconsumer' });
  closeCh(channel, connection);
};

export { exchange, options, queue, send, receive };