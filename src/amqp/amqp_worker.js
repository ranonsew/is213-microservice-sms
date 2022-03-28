"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("twilio");
const dotenv_1 = __importDefault(require("dotenv"));
const amqplib_1 = __importDefault(require("amqplib"));
// json err response message template
const err_msg = (status, message) => ({ status, message });
// environment variables for twilio
dotenv_1.default.config(); // pull .env file stuff into process.env
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
const rabbitHost = process.env.rabbit_host || 'localhost';
const rabbitPort = process.env.rabbit_port || 5672;
// object destructuring because it looks sort of cool
// variables for amqp
const exchange = { name: 'notif_topic', type: 'topic' };
const options = { durable: true };
const queue = { name: 'Twilio-Sms', key: '#' };
// global variables for process.on('exit') to close channel and connection smoothly
let ch;
let conn;
// consume function, opens the connection and channel
async function consume() {
    const connection = await amqplib_1.default.connect({
        protocol: 'amqp',
        hostname: rabbitHost,
        port: rabbitPort,
        locale: 'en_US',
        heartbeat: 3600
    });
    const channel = await connection.createChannel();
    ch = channel; // adding the channel object to ch
    conn = connection; // adding the connection object to conn
    await channel.assertExchange(exchange.name, exchange.type, options); // declaring exchange
    await channel.assertQueue(queue.name, options); // declaring the queue
    await channel.consume(queue.name, async (msg) => {
        if (!msg)
            return; // if null then don't send anything
        const { message, receiver } = JSON.parse(msg.content.toString());
        try {
            if (!message || typeof message != "string" || !receiver || typeof receiver != "string")
                throw err_msg(400, "One or more body variables have not been added.");
            if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER)
                throw err_msg(500, "One or more environment variables are missing.");
            const twilioClient = new twilio_1.Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
            const result = await twilioClient.messages.create({
                from: TWILIO_PHONE_NUMBER,
                to: receiver,
                body: message
            });
            if (!result)
                throw err_msg(500, "Something went wrong while sending the message.");
            console.log({ message: "Message has been sent to the user." });
        }
        catch (err) {
            console.log(err);
        }
        channel.ack(msg); // acknowledge the message
    }, { noAck: false });
}
// perform the consume function to open the connection and listen for messages
consume(); // done like this since async await only works with functions
// on closing with ctrl+c, perform the closing of the channel and connection
process.on('exit', (code) => {
    ch.close();
    conn.close();
});
