import { Twilio } from "twilio";
import dotenv from "dotenv";
import { openConnection } from './consumer_setup';

// json err response message template
const err_msg = (status: number, message: string) => ({ status, message });

// environment variables for twilio
dotenv.config(); // pull .env file stuff into process.env
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER
} = process.env;
// object destructuring because it looks sort of cool

// variables for amqp
const exchange = { name: 'notif_topic', type: 'topic' };
const options = { durable: true };
const queue = { name: 'Twilio-Sms', key: '*.notify' };

// consume function, opens the connection and channel
/**
 * Consume messages from AMQP message broker, RabbitMQ
 */
async function consume() {
  const channel = await openConnection();
  await channel.assertExchange(exchange.name, exchange.type, options); // declaring exchange
  await channel.assertQueue(queue.name, options); // declaring the queue
  await channel.consume(queue.name, async msg => { // consume queue data and do processing (twilio stuff)
    if (!msg) return; // if null then don't send anything
    const { message, receiver } = JSON.parse(msg.content.toString());
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
  }, { noAck: false });
}

// perform the consume function to open the connection and listen for messages
consume(); // done like this since async await only works with functions
