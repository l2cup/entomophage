import { Document } from 'mongoose';

/**
 * @description This is an team document used to represent a Team without overhead.
 */
export type TeamModel = {
  name: string;
  website: string;

  leader: string;
  members: string[];
  projects: string[];

}

/**
 * @description This is an team document used to represent a Team document
 */
export type TeamDocument = Document & TeamModel & {
  getMemberCount: getter<number>;
  getProjectCount: getter<number>;
}

/* Getter type for the getter functions */
type getter<T> = () => T;

/**
 * @description getMemberCount is a getter function for the team model.
 * It returns a member count.
 * @returns {number}
 */
export const getMemberCount: getter<number> = function getMemberCount(): number {
  return this.memberIds.length;
};

/**
 * @description getProjectCount is a getter function for the team model.
 * It returns a project count.
 * @returns {number}
 */
export const getProjectCount: getter<number> = function getProjectCount(): number {
  return this.projects.length;
};
