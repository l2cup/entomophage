import mongoose from 'mongoose';

export type TeamDocument = mongoose.Document & {
  name: string;
  website: string;

  leaderId: number;
  memberIds: string[];
  projectIds: string[];

  getMemberCount: getter<number>;
  getProjectCount: getter<number>;
}

type getter<T> = () => T;

const getMemberCount: getter<number> = function getMemberCount(): number {
  return this.memberIds.length;
};

const getProjectCount: getter<number> = function getProjectCount(): number {
  return this.projectIds.length;
};

const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  leaderId: { type: Number, unique: true, required: true },
  website: String,
  memberIds: [String],
  projectIds: [String],
});

teamSchema.method('getMemberCount', getMemberCount);
teamSchema.method('getProjectCount', getProjectCount);

export const Team = mongoose.model<TeamDocument>('Team', teamSchema);
