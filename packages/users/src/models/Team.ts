import mongoose from 'mongoose';
import { TeamDocument, getMemberCount, getProjectCount } from '@entomophage/common';


const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  leaderId: { type: String, unique: true, required: true },
  website: String,
  members: [String],
  projects: [String],
});

teamSchema.method('getMemberCount', getMemberCount);
teamSchema.method('getProjectCount', getProjectCount);

const Team = mongoose.model<TeamDocument>('Team', teamSchema);

export default Team;
