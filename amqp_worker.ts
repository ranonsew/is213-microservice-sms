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

// global variables for process.on('exit') to close channel and connection smoothly
let ch: amqp.Channel;
let conn: amqp.Connection;

async function consume() {
  const connection = await amqp.connect({
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    locale: 'en_US',
    heartbeat: 3600
  });
  const channel = await connection.createChannel();
  ch = channel;
  conn = connection;
  await channel.assertExchange(exchange.name, exchange.type, options);
  await channel.assertQueue(queue.name, options);
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
    // setTimeout(() => channel.ack(msg), 8000); // for testing purposes (scenario: consumer crashes midway because this code is shit)
    channel.ack(msg); // acknowledge the message
  }, { noAck: false });
}

// perform the consume function to open the connection and listen for messages
consume();

// on closing with ctrl+c, perform the closing of the channel and connection
process.on('exit', (code) => {
  ch.close();
  conn.close();
});
