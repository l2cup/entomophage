import mongoose from 'mongoose';
import { ProjectDocument } from '@entomophage/common';

const projectSchema = new mongoose.Schema({

  name: {
    type: String, immutable: true, required: true, minlength: 3, unique: true,
  },
  website: String,
  description: { type: String, maxlength: 300 },
  license: { type: String, minlength: 3, maxlength: 15 },
  author: { type: String, required: true, immutable: true },
  contributors: [String],
  teamName: { type: String, immutable: false },
  issueIds: [String],
}, { timestamps: true });

projectSchema.pre('save', function save(next) {
  const project = this as ProjectDocument;
  if (!project.isModified('name')) {
    return next();
  }
  project.name = `${project.author}/${project.name}`.trim().replace(/\s/g, '_');
  return next();
});

const Project = mongoose.model<ProjectDocument>('Project', projectSchema);

export default Project;
