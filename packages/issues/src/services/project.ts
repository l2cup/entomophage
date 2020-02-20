import mongoose from 'mongoose';
import { Channel } from 'amqplib';
import {
  mq,
  MessagingQueue,
  QueueMessage,
  MessagingParty,
  Action,
  IssueServiceChangedDataKey,
  ChangedDataType,
  MessageData,
  ProjectDocument,
  UserDocument,
} from '@entomophage/common';
import Project from '../models/Project';

/**
 * @description getProject fetches a single project from the storage by it's name
 * @param {string} name
 * @returns {Promise<UserDocument | null>} */
export const getProject = async (name: string): Promise<ProjectDocument | null> => {
  try {
    const project = await Project.findOne({ name });
    if (project == null) return null;
    return project;
  } catch (err) {
    return err;
  }
};


/**
 * @description crateProject creates a project with a name and an author
 * @param {string} name
 * @param {string} author
 * @returns {Promise<UserDocument>}
 */
export const createProject = async (name: string, author: string): Promise<ProjectDocument | null> => {
  try {
    const existingProject = await Project.findOne({ name });
    if (existingProject != null) {
      throw new mongoose.Error('Project with that name already exists.');
    }
    const project = new Project({ name, author });
    const channel: Channel | null = mq.getIssuesChannel();
    if (channel == null) throw new Error('Problem with creating the project.');
    const changedData = new Map<string, MessageData>();
    changedData.set('name', { data: name, changedDataType: ChangedDataType.STRING });
    changedData.set('user', { data: author, changedDataType: ChangedDataType.STRING });
    const message: QueueMessage = {
      sender: MessagingParty.SERVICE_ISSUES,
      recipient: MessagingParty.SERVICE_USER,
      action: Action.UPDATE,
      changedDataKey: IssueServiceChangedDataKey.PROJECT_AUTHOR,
      changedData,
    };
    const sent = await mq.sendMessage(channel, MessagingQueue.SERVICE_ISSUES_QUEUE, message);
    if (!sent) {
      throw new mongoose.Error('Problem with adding the project to the user.');
    }
    await project.save();
    return project;
  } catch (err) {
    return err;
  }
};

/**
 * @description updateproject updated a project with given parameters in the partial document object.
 * @param {partial<projectdocument>} updated
 * @returns {promise<userdocument | null>}
 */
export const updateProject = async (updated: Partial<ProjectDocument>): Promise<ProjectDocument | null> => {
  try {
    if (updated.name === undefined) throw new mongoose.Error('No name provided.');
    const project = await Project.findOne({ name: updated.name });
    if (project == null) throw new mongoose.Error('Project does not exists.');

    if (updated.website !== undefined) project.website = updated.website;
    if (updated.description !== undefined) project.description = updated.description;
    if (updated.license !== undefined) project.license = updated.license;
    if (updated.contributors !== undefined) {
      const channel: Channel | null = mq.getUsersChannel();
      if (channel == null) throw new Error('Error updating contributors.');
      const changedData = new Map<string, MessageData>();
      changedData.set('project', { data: project, changedDataType: ChangedDataType.PROJECT });
      changedData.set('contributors', { data: updated.contributors, changedDataType: ChangedDataType.STRING_ARRAY });
      const message: QueueMessage = {
        sender: MessagingParty.SERVICE_ISSUES,
        recipient: MessagingParty.SERVICE_USER,
        action: Action.UPDATE,
        changedDataKey: IssueServiceChangedDataKey.PROJECT_CONTRIBUTORS,
        changedData,
      };
      const sent = mq.sendMessage(channel, MessagingQueue.SERVICE_USER_QUEUE, message);
      if (!sent) throw new Error('Error sending a message while updating contributors.');

      project.contributors = updated.contributors;
    }
    if (updated.teamId !== undefined) project.teamId = updated.teamId;
    if (updated.teamName !== undefined) project.teamName = updated.teamName;
    if (updated.issueIds !== undefined) project.issueIds = updated.issueIds;
    await project.save();
    return project;
  } catch (err) {
    return err;
  }
};

/**
 * @description deleteProject deletes a project with a given name.
 * @param {string} name
 * @returns {Promise<boolean>}
 */
export const deleteProject = async (name: string): Promise<boolean> => {
  try {
    const deleted = await Project.findOneAndDelete({ name });
    if (deleted == null) return false;
    const channel: Channel | null = mq.getUsersChannel();
    /* TODO properly handle deletion. */
    if (channel == null) throw new Error('Project deleted but not properly.');
    const changedData = new Map<string, MessageData>();
    changedData.set('project', { data: deleted, changedDataType: ChangedDataType.PROJECT });
    const message: QueueMessage = {
      sender: MessagingParty.SERVICE_ISSUES,
      recipient: MessagingParty.SERVICE_USER,
      action: Action.DELETE,
      changedDataKey: IssueServiceChangedDataKey.PROJECT_AUTHOR,
      changedData,
    };
    const sent = mq.sendMessage(channel, MessagingQueue.SERVICE_USER_QUEUE, message);
    if (!sent) throw new Error('Project deleted but message could');
    return true;
  } catch (err) {
    return err;
  }
};

/**
 * @description updateProjectIdsMQ updates all the projects id's.
 * @param {QueueMessage} message
 * @returns {Promise<void>}
 */
export const updateProjectIdsMQ = async (message: QueueMessage): Promise<void> => {
  try {
    if (message == null || message.changedData == null) throw new Error("Message or it's data is null.");
    if (message.changedData.get('user') == null) throw new Error('User not provided.');
    if (message.changedData.get('user')?.changedDataType !== ChangedDataType.USER) throw new Error('User is wrong data type.');

    const user = message?.changedData?.get('user')?.data as UserDocument;
    if (user == null) throw new Error('User provided is null.');

    if (message.changedData.get('projects') == null) throw new Error('Projects not provided');
    if (message?.changedData?.get('projects')?.changedDataType !== ChangedDataType.STRING_ARRAY) {
      throw new Error('Projects is wrong data type');
    }

    const newProjects = message?.changedData?.get('project_ids')?.data as string[];
    const oldProjects = user.profile.projects as string[];
    if (newProjects == null || oldProjects == null) throw new Error('Projects are null.');

    if (oldProjects.length > newProjects.length) {
      /* Users are deleted from projects */
      const filteredProjects = oldProjects.filter((e) => !newProjects.includes(e));
      let done: boolean[] = await Promise.all(filteredProjects.map(async (name: string): Promise<boolean> => {
        const project = await Project.findOne({ name });
        if (project == null) return false;
        project.contributors = project.contributors.filter((contributor: string) => contributor !== user.username);
        await project.save();
        return true;
      }));
      done = done.filter((e) => e);
      if (done.length !== filteredProjects.length) throw new Error('Error while deleting contributors.');
    } else {
      /* Users are added to the project */
      const filteredProjects = newProjects.filter((e) => !oldProjects.includes(e));
      let done = await Promise.all(filteredProjects.map(async (name): Promise<boolean> => {
        const project = await Project.findOne({ name });
        if (project == null) return false;
        project.contributors.push(user.username);
        project.save();
        return true;
      }));
      done = done.filter((e) => e);
      if (done.length !== filteredProjects.length) throw new Error('Error while adding contributors.');
    }
    return;
  } catch (err) {
    /* TODO Better error handling */
    console.error(err);
  }
};

/**
 * @description updateProjectTeamNameMQ updates all the projects team names.
 * @param {QueueMessage} message
 * @returns {Promise<void>}
 */
export const updateProjectTeamNameMQ = async (message: QueueMessage): Promise<void> => {
  try {
    if (message == null || message.changedData == null) throw new Error("Message or it's data is undefined");
    if (message.changedData.get('old_name') == null) throw new Error('Old name not provided.');
    if (message.changedData.get('old_name')?.changedDataType !== ChangedDataType.STRING) throw new Error('Old name data type is wrong.');

    const oldName = message.changedData.get('old_name')?.data as string;

    if (message.changedData.get('new_name') == null) throw new Error('New name not provided.');
    if (message.changedData.get('new_name')?.changedDataType !== ChangedDataType.STRING) throw new Error('New name data type is wrong.');

    const newName = message.changedData.get('new_name')?.data as string;

    const projects: ProjectDocument[] = await Project.find({ teamName: oldName });
    if (projects == null) throw new Error("Couldn't find the project.");
    const updatedProjects: ProjectDocument[] = await Promise.all(projects.map(async (project) => {
      // eslint-disable-next-line no-param-reassign
      project.teamName = newName;
      const updatedProject = await project.save();
      return updatedProject;
    }));
    if (updatedProjects.length !== projects.length) throw new Error('Error while updating projects.');
  } catch (err) {
    /* TODO better error handling */
    console.error(err);
  }
};
