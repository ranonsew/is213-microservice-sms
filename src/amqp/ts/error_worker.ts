import { openConnection } from './consumer_setup'

const exchange = { name: 'log_topic', type: 'topic' };
const options = { durable: true };
const queue = { name: 'Error_Log', key: '*.error' };

async function consume() {
  const channel = await openConnection();
  await channel.assertExchange(exchange.name, exchange.type, options);
  await channel.assertQueue(queue.name, options);
  await channel.consume(queue.name, msg => {
    if(!msg) return;
    const { code, message } = JSON.parse(msg.content.toString()); // error code + error message
    // send to error log db
    channel.ack(msg);
  }, { noAck: false });
}

consume();
