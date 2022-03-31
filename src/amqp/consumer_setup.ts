import amqp from 'amqplib';

const rabbitHost = process.env.rabbit_host || 'localhost';
const rabbitPort = <number><any>process.env.rabbit_port || 5672;

/**
 * 
 * @returns {Promise<amqp.Channel>} an amqp channel that is connected to the RabbitMQ
 */
export async function openConnection() {
  const connection = await amqp.connect({
    protocol: 'amqp',
    hostname: rabbitHost,
    port: rabbitPort,
    locale: 'en_US',
    heartbeat: 3600
  });
  return await connection.createChannel();
}
