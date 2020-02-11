import mongoose from 'mongoose';
import { User, UserDocument } from '../models/User';
import { Team } from '../models/Team';

/**
 * @description Fetches single user from the storage by email
 * @param email
 * @returns {Promise<User>}
 */
export async function getUserByEmail(email: string): Promise<UserDocument> {
  try {
    const user = await User.findOne({ email });
    if (user == null) throw new mongoose.Error('User not found');
    return user;
  } catch (err) {
    return err;
  }
}


/**
 * @description Fetches single user from the storage by it's teamId
 * @param {number} teamId
 * @returns {Promise<User>}
 */
export async function getUserByTeamId(teamId: number): Promise<UserDocument> {
  try {
    const user = await User.findOne({ teamId });
    if (user == null) throw new mongoose.Error('User not found');
    return user;
  } catch (err) {
    return err;
  }
}

/**
 * @description Checks if a user exists, and if it does,
 * updates and returns the updated UserDocument
 * @param {UserDocument} updated
 * @returns {Promise<UserDocument>}
 * TODO mq to send a message to the other services to update user
 */
export async function updateUser(updated: UserDocument): Promise<UserDocument> {
  try {
    const user = await User.findOneAndUpdate(updated.id, updated, { new: true });
    if (user == null) throw new mongoose.Error('User not found');
    return user;
  } catch (err) {
    return err;
  }
}

/**
 * @description Checks if a user exists, removes it from it's team,
 * and finally removes the user from the databse.
 * TODO mq to send a message to the other services to remove user
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export async function deleteUser(email: string): Promise<boolean> {
  try {
    const user = await User.findOne({ email });
    if (user == null) throw new mongoose.Error('User not found.');
    let team = await Team.findOne({ name: user.profile.teamName });
    if (team == null) {
      const deleted = await User.deleteOne(user);
      return deleted > 0;
    }
    team.memberIds = team.memberIds.filter((v) => v !== user.id);
    team = await Team.updateOne({ name: team.name }, team, { runValidators: true, new: true });
    if (team != null) {
      await Promise.all([team.save(), User.deleteOne(user)]);
      return true;
    }
    User.deleteOne(user);
    return true;
  } catch (err) {
    return err;
  }
}

/**
 * @description Creates a new user, if the user previously existed with the same email,
 * as the provided email, it will throw an error.
 * @throws {mongoose.Error} User already exists
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserDocument>}
 */
export async function createUser(email: string, password: string): Promise<UserDocument> {
  try {
    let user = await User.findOne({ email });
    if (user != null) {
      throw new mongoose.Error('User already exists.');
    }
    user = new User({ email, password });
    return user;
  } catch (err) {
    return err;
  }
}
