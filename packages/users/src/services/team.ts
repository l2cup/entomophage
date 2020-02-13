import mongoose from 'mongoose';
import { Team, TeamDocument } from '../models/Team';
import { UserDocument } from '../models/User';
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
    let memberIds: string[] = await Promise.all(usernames.map(async (username: string) => {
      const user = await userService.getUserByUsername(username);
      if (user == null) return '';
      return user.id;
    }));
    memberIds = memberIds.filter((id) => id !== '');
    const newTeam = new Team({ name, leaderId: leader.id, memberIds });
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
    team.memberIds.forEach(async (id) => {
      const partialUpdated: Partial<UserDocument> = { id, profile: { teamId: '', teamName: '' } };
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
    const team = await Team.findById(user.profile?.teamId);
    if (team == null) throw new mongoose.Error('Team not found.');
    team.memberIds = team.memberIds.filter((id) => id !== team.id);
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
      if (newNameTeam !== undefined) team.name = newName as string;
    }
    if (updated.memberIds !== undefined) team.memberIds = updated.memberIds;
    if (updated.projectIds !== undefined) team.projectIds = updated.projectIds;
    if (updated.leaderId !== undefined) team.leaderId = updated.leaderId;
    if (updated.website !== undefined) team.website = updated.website;
    await team.save();
    return team;
  } catch (err) {
    return err;
  }
};
