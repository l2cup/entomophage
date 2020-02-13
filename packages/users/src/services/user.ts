import mongoose from 'mongoose';
import { User, UserDocument } from '../models/User';
import { Team } from '../models/Team';

/**
 * @description getUserByEmail fetches a single user from the storage by email
 * @param email
 * @returns {Promise<UserDocument>}
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
 * @returns {Promise<UserDocument>}
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
 * TODO mq to send a message to the other services to update user
 */
export const updateUser = async (updated: Partial<UserDocument>): Promise<UserDocument | null> => {
  try {
    let user: UserDocument | null;
    if (updated.username !== undefined) {
      user = await User.findOne({ username: updated.username });
    } else if (updated.id !== undefined) {
      user = await User.findById(updated.id);
    } else {
      return null;
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
    if (updated.profile?.projectIds !== undefined) user.profile.projectIds = updated.profile?.projectIds;
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
    team.memberIds = team.memberIds.filter((v) => v !== user.id);
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
