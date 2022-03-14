import amqp from "amqplib";
const open = amqp.connect("amqp://localhost");
open.then((connection) => connection.createChannel())
  .then((channel) => {
    channel.assertExchange("message_topic", "topic", { durable: true })
  })
  .catch(err => { throw err });