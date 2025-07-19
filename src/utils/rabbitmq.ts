
import amqp from 'amqplib';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;

if (!RABBITMQ_URL) {
  throw new Error('RABBITMQ_URL is not defined in .env file');
}

// let connection: amqp.Connection;
let connection: amqp.ChannelModel;
// let channel: amqp.Channel;
let channel: amqp.Channel;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    throw error;
  }
};

connectRabbitMQ();

export const publishMessage = async (queue: string, pattern: string, message: any) => {
  try {
    //await channel.assertQueue(queue, { durable: false });
    await channel.assertExchange('main_exchange','topic', { durable: true })
    channel.publish('main_exchange', queue, Buffer.from(JSON.stringify({ pattern, data: message })))
    //channel.sendToQueue(queue, Buffer.from(JSON.stringify({ pattern, data: message })));
  } catch (error) {
    console.error(`Failed to publish message to queue ${queue}`, error);
    throw error;
  }
};

export const requestResponse = async (queue: string, pattern: string, message: any): Promise<any> => {
  try {
    const replyQueue = await channel.assertQueue('', { exclusive: true });
    const correlationId = uuidv4();

    const consumer = new Promise((resolve, reject) => {
        channel.consume(replyQueue.queue, (msg) => {
            if (msg && msg.properties.correlationId === correlationId) {
                resolve(JSON.parse(msg.content.toString()));
                channel.ack(msg);
            }
        }, { noAck: false });
    });

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ pattern, data: message })), {
      correlationId,
      replyTo: replyQueue.queue,
    });

    return await consumer;
  } catch (error) {
    console.error(`Failed to send request to queue ${queue}`, error);
    throw error;
  }
};
