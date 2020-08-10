import { Document } from 'mongoose';

/*
 * @description This is an user model used to represent a User without overhead.
 */
export type UserModel = {
  username: string;
  email?: string;
  password?: string;

  profile: {
    name?: string;
    gender?: string;
    location?: string;
    website?: string;
    teamName?: string;
    projects?: string[];
  };

}

/**
 * @description This is an user document used to represent a User mongoose model.
 */
export type UserDocument = Document & UserModel & {
  comparePassword: comparePasswordFunction;
}

/**
 * @description This is a comparePasswordFunction type used to represent a compare function used to compare passwords.
 */
export type comparePasswordFunction =
  (candidatePassword: string) => Promise<boolean>;
