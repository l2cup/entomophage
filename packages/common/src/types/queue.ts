/**
 * @description Services which send the messages.
 */
export enum MessagingParty {
  SERVICE_USER,
  SERVICE_ISSUES
}

/**
 * @description Possible messaging queues for connection.
 */
export enum MessagingQueue {
  SERVICE_USER_QUEUE = 'userQueue',
  SERVICE_ISSUES_QUEUE = 'issueQueue'
}

/**
 * @description Action which the service performed on the data before sending the message.
 */
export enum Action {
  CREATE,
  UPDATE,
  DELETE
}

/**
 * @description User service Entity keys that are changed.
 * It's shape is ENTITY_KEY
 */
export enum UserServiceChangedDataKey {
  USER_TEAMNAME,
  USER_PROJECTIDS
}

/**
 * @description Issue service Entity keys that are changed.
 * It's shape is ENTITY_KEY.
 */
export enum IssueServiceChangedDataKey {
  PROJECT_AUTHOR,
  PROJECT_CONTRIBUTORS
}

/**
 * @description Possible changed data type enum.
 * It has all currently changeable data types as values. If needed more will be added.
 * For now the most general type is OBJECT which is used to represent an any type.
 */
export enum ChangedDataType {
  STRING,
  STRING_ARRAY,
  NUMBER,
  NUMBER_ARRAY,
  PROJECT,
  USER,
  ISSUE,
  TEAM,
  OBJECT,
}

/* Joint type of all service data keys */
type ChangedDataKey = UserServiceChangedDataKey | IssueServiceChangedDataKey;

/**
 * @description MessageData represents an object which holds both data and it's type
 * represented by the ChangedDataType enum.
 */
export type MessageData = {
  data: any;
  changedDataType: ChangedDataType;
}

/**
 * @description QueueMessage is a messaging prototype.
 * Every queue message has to use this data prototype.
 * This is a custom declared prototype for data sending between services.
 * This is version 0.1.0 so much improvement needed. But for now all messages use this.
 */
export type QueueMessage = {
  sender: MessagingParty;
  recipient: MessagingParty;
  action: Action;
  changedDataKey: ChangedDataKey;
  changedData: Map<string, MessageData>;
}
