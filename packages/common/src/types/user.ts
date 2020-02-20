import { Document } from 'mongoose';

/**
 * @description This is an user document used to represent a User model
 */
export type UserDocument = Document & {
  username: string;
  email: string;
  password: string;

  profile: {
    name?: string;
    gender?: string;
    location?: string;
    website?: string;
    teamName?: string;
    teamId?: string;
    projects?: string[];
  };

  comparePassword: comparePasswordFunction;
}

/**
 * @description This is a comparePasswordFunction type used to represent a compare function used to compare passwords.
 */
export type comparePasswordFunction =
  (candidatePassword: string) => Promise<boolean>;
