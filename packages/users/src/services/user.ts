import mongoose from 'mongoose';
import { Channel } from 'amqplib';
import {
  mq, MessagingParty,
  MessagingQueue, Action,
  UserServiceChangedDataKey,
  QueueMessage, MessageData,
  ChangedDataType,
  UserDocument,
  ProjectDocument,
} from '@entomophage/common';
import User from '../models/User';
import Team from '../models/Team';


/**
 * @description getUserByEmail fetches a single user from the storage by email
 * @param email
 * @returns {Promise<UserDocument | null>}
 */
export const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
  try {
    const user = await User.findOne({ email });
    if (user == null) return null;
    return user;
  } catch (err) {
    return err;
  }
};


/**
 * @description getUserByUsername fetches single user from the storage by email
 * @param username
 * @returns {Promise<UserDocument | null>}
 */
export const getUserByUsername = async (username: string): Promise<UserDocument | null> => {
  try {
    const user = await User.findOne({ username });
    if (user == null) return null;
    return user;
  } catch (err) {
    return err;
  }
};


/**
 * @description getUserById fetches single user from the storage by email
 * @param email
 * @returns {Promise<UserDocument | null>}
 */
export const getUserById = async (id: string): Promise<UserDocument | null> => {
  try {
    const user = await User.findById(id);
    if (user == null) return null;
    return user;
  } catch (err) {
    return err;
  }
};


/**
 * @description getUsersByTeamId fetches multiple users from the storage by it's teamId
 * @param {string} teamId
 * @returns {Promise<UserDocument[]>}
 */
export const getUsersByTeamId = async (teamId: string): Promise<UserDocument[]> => {
  try {
    const user = await User.find({ teamId });
    if (user == null) return [];
    return user;
  } catch (err) {
    return err;
  }
};

/**
 * @description getUsersByTeamName fetches multiple users from the storage by it's teamName
 * @param {string} teamName
 * @returns {Promise<UserDocument[]>}
 */
export const getUsersByTeamName = async (teamName: string): Promise<UserDocument[]> => {
  try {
    const user = await User.find({ teamName });
    if (user == null) return [];
    return user;
  } catch (err) {
    return err;
  }
};

/**
 * @description updateUser checks if a user exists, and if it does,
 * updates and returns the updated UserDocument
 * @param {UserDocument} updated
 * @returns {Promise<UserDocument | null>}
 */
export const updateUser = async (updated: Partial<UserDocument>): Promise<UserDocument | null> => {
  try {
    let user: UserDocument | null;
    if (updated.username !== undefined) {
      user = await User.findOne({ username: updated.username });
    } else if (updated.id !== undefined) {
      user = await User.findById(updated.id);
    } else {
      throw new Error('No username or id provided.');
    }
    if (user === null) return null;
    if (updated.email !== undefined) user.email = updated.email;
    if (updated.password !== undefined) user.password = updated.password;
    if (updated.profile?.name !== undefined) user.profile.name = updated.profile?.name;
    if (updated.profile?.location !== undefined) user.profile.location = updated.profile?.location;
    if (updated.profile?.gender !== undefined) user.profile.gender = updated.profile?.gender;
    if (updated.profile?.website !== undefined) user.profile.website = updated.profile?.website;
    if (updated.profile?.teamName !== undefined) user.profile.teamName = updated.profile?.teamName;
    if (updated.profile?.teamId !== undefined) user.profile.teamId = updated.profile?.teamId;
    if (updated.profile?.projects !== undefined) {
      const channel: Channel | null = mq.getIssuesChannel();
      if (channel == null) throw new Error('Channel error while updating projectIds.');
      const changedData: Record<string, MessageData> = {
        user: { data: user, changedDataType: ChangedDataType.USER },
        projects: { data: updated?.profile.projects, changedDataType: ChangedDataType.STRING_ARRAY },
      };
      const message: QueueMessage = {
        sender: MessagingParty.SERVICE_USER,
        recipient: MessagingParty.SERVICE_ISSUES,
        action: Action.UPDATE,
        changedDataKey: UserServiceChangedDataKey.USER_PROJECTIDS,
        changedData,
      };
      const sent = mq.sendMessage(channel, MessagingQueue.SERVICE_ISSUES_QUEUE, message);
      if (!sent) throw new Error('Message error while updating projectIds.');
      user.profile.projects = updated.profile?.projects;
    }
    await user.save();
    return user;
  } catch (err) {
    return err;
  }
};

/**
 * @description deleteUser chekcs if a user exists, removes it from it's team,
 * and finally removes the user from the databse.
 * TODO mq to send a message to the other services to remove user
 * @param {string} username
 * @returns {Promise<boolean>}
 */
export const deleteUser = async (username: string): Promise<boolean> => {
  try {
    const user = await User.findOne({ username });
    if (user == null) throw new mongoose.Error('User not found.');
    const team = await Team.findOne({ name: user.profile.teamName });
    if (team == null) {
      const deleted = await User.deleteOne(user);
      return deleted > 0;
    }
    team.members = team.members.filter((memberUsername) => memberUsername !== user.username);
    await Promise.all([team.save(), User.deleteOne(user)]);
    return true;
  } catch (err) {
    return err;
  }
};

/**
 * @description createUser creates a new user, if the user previously existed with the same email,
 * as the provided email, it will throw an error.
 * @throws {mongoose.Error} User already exists
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserDocument>}
 */
export const createUser = async (username: string, email: string, password: string): Promise<UserDocument> => {
  try {
    let user = await User.findOne({ email });
    if (user != null) {
      throw new mongoose.Error('User already exists.');
    }
    user = new User({ username, email, password });
    await user.save();
    return user;
  } catch (err) {
    return err;
  }
};

/**
 * @description updateUserProjectIdsMQ updates all the user projectIds.
 * @param {QueueMessage} message
 * @returns {Promise<void>}
 */
export const updateUserProjectIdsMQ = async (message: QueueMessage): Promise<void> => {
  try {
    if (message == null || message.changedData == null) throw new Error("Message or it's data is null.");
    if (message.changedData.project == null) throw new Error('Project not provided.');
    if (message.changedData.project?.changedDataType !== ChangedDataType.PROJECT) throw new Error('Project is wrong data type.');

    /* project holds old contributors */
    const project = message.changedData.project?.data as ProjectDocument;
    if (project == null) throw new Error('Provided project is null.');

    if (message.changedData.contributors == null) throw new Error('Contributors not provided.');
    if (message.changedData.contributors.changedDataType !== ChangedDataType.STRING_ARRAY) {
      throw new Error('Contributors is wrong data type.');
    }

    const newContributors = message.changedData.contributors?.data as string[];
    if (newContributors == null) throw new Error('Provided contributors is null.');

    if (project.contributors.length > newContributors.length) {
      /* Contributors were deleted. */
      const filteredContributors = project.contributors.filter((e) => !newContributors.includes(e));
      let done: boolean[] = await Promise.all(filteredContributors.map(async (contributorUsername: string) => {
        let user = await User.findOne({ username: contributorUsername });
        if (user == null) return false;
        /* This is an error, but still we return true because the user isn't even a contributor,
         * so the operation is kinda succesful. */
        if (user.profile == null) return true;
        if (user.profile.projects == null) return true;
        user.profile.projects = user.profile.projects.filter((name) => name !== project.name);
        user = await user.save();
        if (user == null) return false;
        return true;
      }));
      done = done.filter((e) => e);
      if (done.length !== filteredContributors.length) throw new Error('There was an error updating users. Users partialy updated.');
    } else {
      const filteredContributors = newContributors.filter((e) => !project.contributors.includes(e));
      let done: boolean[] = await Promise.all(filteredContributors.map(async (contributorUsername) => {
        let user = await User.findOne({ username: contributorUsername });
        if (user == null) return false;
        if (user.profile == null) user.profile = { projects: [] };
        if (user.profile.projects == null) user.profile.projects = [];
        user.profile.projects.push(project.name);
        user = await user.save();
        if (user == null) return false;
        return true;
      }));
      /* Contributors were added. */
      done = done.filter((e) => e);
      if (done.length !== filteredContributors.length) throw new Error('There was an error updating users. Users partialy updated.');
    }
  } catch (err) {
    /* TODO better error handling */
    console.error(err);
  }
};

/**
 * @description updateUserProjectAuthorMQ updates the author's projects.
 * @param {QueueMessage} message
 * @returns {Promise<void>}
 */
export const updateUserProjectAuthorMQ = async (message: QueueMessage): Promise<void> => {
  try {
    console.log(message);
    if (message == null || message.changedData == null) throw new Error("Message or it's data is null.");
    if (message.changedData.project == null) throw new Error('Project not provided.');
    if (message.changedData.project?.changedDataType !== ChangedDataType.PROJECT) throw new Error('Project is wrong data type.');

    const project = message.changedData.project?.data as ProjectDocument;
    if (project == null) throw new Error('Provided project is null.');

    const user = await User.findOne({ username: project.author });
    if (user == null) throw new Error('Author not found.');
    if (user.profile == null || user.profile.projects == null) throw new Error('Profile is nul.');
    if (message.action === Action.DELETE) {
      user.profile.projects = user.profile.projects.filter((name: string) => name !== project.name);
    } else {
      user.profile.projects.push(`${user.username}/${project.name}`);
    }
    await user.save();
  } catch (err) {
    console.error(err);
  }
};
