import { Document } from 'mongoose';

export type ProjectDocument = Document & {
  name: string;
  website: string;
  description: string;
  license: string;
  author: string;
  contributors: string[];
  teamName: string;
  teamId: string;
  issueIds: string[];
};
