// rabbitmq-mgmt container id: 0c476c4886f8
// localhost:15672 -- rabbitmq

import { Twilio } from "twilio";
import dotenv from "dotenv";
import amqp from "amqplib";

// json err response message template
const err_msg = (status: number, message: string) => ({ status, message });

// environment variables for twilio
dotenv.config(); // pull .env file stuff into process.env
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER} = process.env;
// object destructuring because it looks sort of cool

// variables for amqp
const exchange = { name: 'message_topic', type: 'topic' };
const options = { durable: true };
const queue = { name: 'Twilio-Sms', key: '*.notification' };

// helper function: open connection to rabbitmq
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

// helper function: close connection to rabbitmq
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
  const { channel, connection } = await openChannel(); // open connection
  await channel.assertQueue(queue.name, options); // assert queue
  await channel.consume(queue.name, async msg => { // consume queue data and do processing
    if (!msg) return; // if null then don't send anything
    const { message, receiver } = JSON.parse(msg.content.toString());
    console.log(message, receiver);
    try {
      if (!message || typeof message != "string" || !receiver || typeof receiver != "string") throw err_msg(400, "One or more body variables have not been added.");
      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) throw err_msg(500, "One or more environment variables are missing.");
      const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const result = await twilioClient.messages.create({
        from: TWILIO_PHONE_NUMBER,
        to: receiver,
        body: message
      });
      if (!result) throw err_msg(500, "Something went wrong while sending the message.");
      console.log({ message: "Message has been sent to the user." });
    } catch (err) { console.log(err); }
    channel.ack(msg); // acknowledge the message
    channel.cancel('myconsumer'); // stop receiving messages
  }, { consumerTag: 'myconsumer' }); // setting tag to stop receiving for the fire and forget
  closeCh(channel, connection); // close connection
};

export { send, receive }