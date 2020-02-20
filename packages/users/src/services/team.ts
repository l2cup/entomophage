import mongoose from 'mongoose';
import { Channel } from 'amqplib';
import {
  mq,
  MessagingParty,
  MessagingQueue, Action,
  UserServiceChangedDataKey,
  QueueMessage, MessageData,
  ChangedDataType,
  TeamDocument, UserDocument,
} from '@entomophage/common';
import Team from '../models/Team';
import * as userService from './user';

/**
 * @description getTeam fetches a single team from the storage by it's name
 * @param {string} name
 * @returns {Promise<TeamDocument | null>}
 */
export const getTeam = async (name: string): Promise<TeamDocument | null> => {
  try {
    const team = await Team.findOne({ name });
    if (team == null) return null;
    return team;
  } catch (err) {
    return err;
  }
};

/**
 * @description createTeam creates a new team. It takes the leader username, and username of current team members.
 * If it fails creating a team it will return null, else it will return the new team.
 *
 * Note: Team names are unique.
 * @param {string} name
 * @param {string} leaderUsername
 * @param {string[]} usernames
 *  @returns {Promise<TeamDocument | null>} */
export const createTeam = async (name: string, leaderUsername: string, usernames: string[]): Promise<TeamDocument | null> => {
  try {
    if (leaderUsername == null) throw new mongoose.Error('Leader not provided.');
    const existingTeam = await Team.findOne({ name });
    if (existingTeam != null) throw new mongoose.Error('Team already exists');
    const leader = await userService.getUserByUsername(leaderUsername);
    if (leader == null) throw new mongoose.Error('Leader not found.');

    /* This actually checks if all users exist, and if they do it just returns the username. */
    let members: string[] = await Promise.all(usernames.map(async (username: string) => {
      const user = await userService.getUserByUsername(username);
      if (user == null) return '';
      return user.username;
    }));
    members = members.filter((id) => id !== '');

    const newTeam = new Team({ name, leader: leader.username, members });
    if (newTeam == null) return null;
    await newTeam.save();
    return newTeam;
  } catch (err) {
    return err;
  }
};

/**
 * @description deleteTeam finds if the team exits, and if it does it deletes it.
 * It returns a boolean indicating if the deletion was succesful.
 * @param {string} name
 * @returns {Promise<boolean>}
 */
export const deleteTeam = async (name: string): Promise<boolean> => {
  try {
    const team = await Team.findOneAndDelete({ name });
    if (team == null) return false;
    team.members.forEach(async (id) => {
      const partialUpdated: Partial<UserDocument> = { id, profile: { teamName: '' } };
      const updated = await userService.updateUser(partialUpdated);
      if (updated == null) return false;
      return true;
    });
    return true;
  } catch (err) {
    return err;
  }
};

/**
 * @description removeFromTeam removes a user with the passed username from it's team.
 * If it finds the user and removes it from the tame, it returns the team, else returns null
 * @param {string} username
 * @returns {Promise<TeamDocument | null>}
 */
export const removeFromTeam = async (username: string): Promise<TeamDocument | null> => {
  try {
    const user = await userService.getUserByUsername(username);
    if (user == null) throw new mongoose.Error('User not found.');
    const team = await Team.findOne({ name: user.profile?.teamName });
    if (team == null) throw new mongoose.Error('Team not found.');
    team.members = team.members.filter((memberUsername) => memberUsername !== username);
    await team.save();
    return team;
  } catch (err) {
    return err;
  }
};

/**
 * @description updateTeam updates the team with the passed values.
 * Because of the partial document holding it's name, the newname optional is used to
 * pass a name to the function if the name should be changed.
 * TODO: Change how this works, not conventinal now.
 * @param {Partial<TeamDocument>} updated
 * @param {string?} newName
 * @returns {Promise<TeamDocument | null>}
 */
export const updateTeam = async (updated: Partial<TeamDocument>, newName?: string): Promise<TeamDocument | null> => {
  try {
    let team: TeamDocument | null;
    if (updated.name !== undefined) {
      team = await Team.findOne({ name: updated.name });
    } else if (updated.id !== undefined) {
      team = await Team.findById(updated.id);
    } else {
      throw new mongoose.Error('Name or id not provided.');
    }
    if (team == null) return null;
    if (newName !== undefined && newName !== '') {
      const newNameTeam = await Team.findOne({ name: newName });
      if (newNameTeam !== undefined) {
        team.name = newName as string;
        /* Updates all team's members teamName to the new name */
        const updatedUsers = await Promise.all(team.members.map(async (username) => userService.updateUser({
          username,
          profile: { teamName: newName },
        })));
        /* Mq logic is here because if the name isn't changed, no need to go into this branch */
        const channel: Channel | null = mq.getIssuesChannel();
        if (channel == null) throw new Error('Channel error while updating name.');
        const changedData: Record<string, MessageData> = {
          oldName: { data: team.name, changedDataType: ChangedDataType.STRING },
          newName: { data: newName, changedDataType: ChangedDataType.STRING },
        };
        const message: QueueMessage = {
          sender: MessagingParty.SERVICE_USER,
          recipient: MessagingParty.SERVICE_ISSUES,
          action: Action.UPDATE,
          changedDataKey: UserServiceChangedDataKey.USER_TEAMNAME,
          changedData,
        };
        const sent = mq.sendMessage(channel, MessagingQueue.SERVICE_ISSUES_QUEUE, message);
        if (!sent) throw new Error('Message error while updating name.');
      }
    }
    if (updated.members !== undefined) team.members = updated.members;
    if (updated.projects !== undefined) team.projects = updated.projects;
    if (updated.leader !== undefined) team.leader = updated.leader;
    if (updated.website !== undefined) team.website = updated.website;
    await team.save();
    return team;
  } catch (err) {
    return err;
  }
};
