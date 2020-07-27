import amqp from 'amqplib';
import { MessagingQueue, QueueMessage } from '../types/queue';

/**
 * @description connectToQueue connects to a queue, asserts it and returns either null or the channel for messaging
 * @param {MessagingQueue} queue
 * @returns {Promise<amqp.Channel | null>}
 */
export const connectToQueue = async (queue: MessagingQueue, url: string): Promise<amqp.Channel | null> => {
  try {
    if (url == undefined) {
      url = 'amqp://localhost';
      console.log('url undefined');
    }
    const connection = await amqp.connect(url);
    if (connection == null) return null;
    const channel = await connection.createChannel();
    if (channel == null) return null;
    await channel.assertQueue(queue, { durable: true });
    return channel;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * @description sendMessage sends a message to the provided queue, through the provided channel
 * @param {amqp.Channel} channel
 * @param {MessagingQueue} queue
 * @param {QueueMessage} message
 * @returns {Promise<boolean>}
 */
export const sendMessage = async (channel: amqp.Channel, queue: MessagingQueue, message: QueueMessage): Promise<boolean> => {
  try {
    if (channel === undefined) return false;
    if (message === undefined) return false;
    const sent: boolean = channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    return sent;
  } catch (err) {
    console.error(err);
    return err;
  }
};

/* Unexported queues which are delcared let */
let usersQueueChannel: amqp.Channel | null;
let issuesQueueChannel: amqp.Channel | null;

/**
 * @description connectToQueues is a method for connecting to both queues used by services.
 * It is here as a helper method. It will be replaced by a generalized function when this hits 1.0.0
 * @returns {Promise<void>}
 */
export const connectToQueues = async (url: string): Promise<void> => {
  try {
    usersQueueChannel = await connectToQueue(MessagingQueue.SERVICE_USER_QUEUE, url);
    if (usersQueueChannel == null) return;
    console.log('QUEUE | Connected to user service queue.');
    issuesQueueChannel = await connectToQueue(MessagingQueue.SERVICE_ISSUES_QUEUE, url);
    if (issuesQueueChannel == null) return;
    console.log('QUEUE | Connected to issue service queue.');
    return;
  } catch (err) {
    console.log(err);
  }
};

/**
 * @description getUsersChannel is a getter used to get a channel.
 * Both channels are declared as a let and not exported because they are initiated
 * by an async function. This is exported as a workaround.
 * It returns the appropriate channel or null if it is not connected to one.
 * @returns {amqp.Channel | null}
 */
export const getUsersChannel = (): amqp.Channel | null => {
  if (usersQueueChannel == null) return null;
  return usersQueueChannel;
};

/**
 * @description getUsersChannel is a getter used to get a channel.
 * Both channels are declared as a let and not exported because they are initiated
 * by an async function. This is exported as a workaround.
 * It returns the appropriate channel or null if it is not connected to one.
 * @returns {amqp.Channel | null}
 */
export const getIssuesChannel = (): amqp.Channel | null => {
  if (issuesQueueChannel == null) return null;
  return issuesQueueChannel;
};
