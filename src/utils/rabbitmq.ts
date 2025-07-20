import amqp from 'amqplib';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;

if (!RABBITMQ_URL) {
  throw new Error('RABBITMQ_URL is not defined in .env file');
}

let connection: amqp.ChannelModel;
let channel: amqp.Channel;

const connectRabbitMQ = async () => {
  try {
    // Establish a single, long-lived connection to the RabbitMQ server
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    // Exit the process if the connection fails, as the app cannot function without it.
    process.exit(1);
  }
};

// Call connectRabbitMQ at the top level to ensure the connection is established on startup.
connectRabbitMQ();

/**
 * Publishes a message for an @EventPattern (fire-and-forget).
 * No response is expected.
 * @param queue The target queue name (e.g., 'reviews').
 * @param pattern The pattern defined in the NestJS @EventPattern decorator.
 * @param message The payload to send.
 */
export const publishMessage = async (queue: string, pattern: string, message: any) => {
  try {
    // Assert the queue to ensure it exists. Must match consumer properties.
    // Changed durable: true -> false to match the NestJS consumer.
    await channel.assertQueue(queue, { durable: false });
    
    // Send the message with the pattern NestJS expects.
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ pattern, data: message })));
  } catch (error) {
    console.error(`Failed to publish message to queue ${queue}`, error);
    throw error;
  }
};

/**
 * Sends a message for a @MessagePattern (request-response).
 * Waits for a response from the consumer.
 * @param queue The target queue name (e.g., 'reviews').
 * @param pattern The in the NestJS @MessagePattern decorator.
 * @param message The payload to send.
 * @returns A Promise that resolves with the response from the consumer.
 */
export const requestResponse = async (queue: string, pattern: string, message: any): Promise<any> => {
  try {
    // Create a temporary, exclusive queue to receive the response.
    const replyQueue = await channel.assertQueue('', { exclusive: true, durable: false });
    const correlationId = uuidv4();

    const consumerPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            channel.close(); // Clean up channel on timeout
            reject(new Error('Request timed out'));
        }, 30000); // 10-second timeout

        channel.consume(replyQueue.queue, (msg) => {
            if (msg?.properties.correlationId === correlationId) {
                clearTimeout(timeout);
                resolve(JSON.parse(msg.content.toString()));
                channel.ack(msg);
                channel.cancel(msg.fields.consumerTag);
            }
        }, { noAck: false });
    });

    // Assert the target queue to ensure it exists.
    // Changed durable: true -> false to match the NestJS consumer.
    await channel.assertQueue(queue, { durable: false });

    // Send the message with the correlationId and replyTo properties.
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ pattern, data: message })), {
      correlationId,
      replyTo: replyQueue.queue,
    });

    return await consumerPromise;
  } catch (error) {
    console.error(`Failed to send request to queue ${queue}`, error);
    throw error;
  }
};

export const closeConnection = async () => {
  try {
    // Gracefully close the channel and the connection.
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Failed to close RabbitMQ connection', error);
  }
};

// Ensure the connection is closed when the application exits.
process.on('exit', closeConnection);
