import { openConnection } from './consumer_setup'

const exchange = { name: 'log_topic', type: 'topic' };
const options = { durable: true };
const queue = { name: 'Activity_Log', key: '#' };

/**
 * returns
 */
async function consume() {
  const channel = await openConnection();
  await channel.assertExchange(exchange.name, exchange.type, options);
  await channel.assertQueue(queue.name, options);
  await channel.consume(queue.name, msg => {
    if(!msg) return;
    const activity = JSON.parse(msg.content.toString()); // activity log related stuff
    console.log(activity);
    channel.ack(msg);
  }, { noAck: false });
}

consume();
