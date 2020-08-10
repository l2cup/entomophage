import mongoose from 'mongoose';
import { IssueDocument, IssueLabel } from '@entomophage/common';

const issueSchema = new mongoose.Schema({

  label: {
    type: String, required: true, enum: Object.keys(IssueLabel),
  },
  state: {
    type: String, required: true, min: 0, max: 4,
  },
  name: {
    type: String, required: true, immutable: true,
  },
  project: {
    type: String, required: true, immutable: true,
  },
  issuedBy: {
    type: String, required: true, immutable: true,
  },

  metadata: {
    type: Map,
    of: String,
  },

}, { timestamps: true });

const Issue = mongoose.model<IssueDocument>('Issue', issueSchema);

export default Issue;
