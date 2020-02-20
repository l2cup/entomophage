import {
  mq, MessagingQueue, QueueMessage, MessagingParty, IssueServiceChangedDataKey,
} from '@entomophage/common';
import { Channel, ConsumeMessage } from 'amqplib';

let channel: Channel | null = null;

const parseIssueMessage = async (message: QueueMessage): Promise<void> => {
  switch (message.changedDataKey) {
    case IssueServiceChangedDataKey.PROJECT_AUTHOR:
      break;
    case IssueServiceChangedDataKey.PROJECT_CONTRIBUTORS:
      break;
    default:
  }
};

const onMessage = async (message: ConsumeMessage | null): Promise<void> => {
  if (channel == null) return;
  if (message == null || message.content == null) return;
  try {
    const queueMessage = JSON.parse(message.content.toString()) as QueueMessage;
    switch (queueMessage.sender) {
      case MessagingParty.SERVICE_ISSUES:
        await parseIssueMessage(queueMessage);
        break;
      default:
    }
  } catch (err) {
    console.error(err);
    return;
  }
  channel.ack(message as ConsumeMessage);
};


const listenForMessages = async (): Promise<void> => {
  channel = mq.getUsersChannel();
  if (channel == null) throw new Error('Channel not initiated.');
  try {
    channel.prefetch(1);
    channel.consume(MessagingQueue.SERVICE_ISSUES_QUEUE, onMessage, { noAck: true });
  } catch (err) {
    console.error(err);
  }
};


export default listenForMessages;
