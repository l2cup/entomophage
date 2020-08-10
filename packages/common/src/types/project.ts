import { Document } from 'mongoose';

export type ProjectModel = {
  name: string;
  website: string;
  description: string;
  license: string;
  author: string;
  contributors: string[];
  teamName: string;
  issueIds: string[];
};

export type ProjectDocument = Document & ProjectModel;
