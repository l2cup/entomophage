import mongoose from 'mongoose';
import { IssueState, IssueLabel, IssueDocument } from '@entomophage/common';
import Issue from '../models/Issue';
import Project from '../models/Project';

/**
 * @description getIssue fetches a single issue from the storage by it's id.
 * @param {string} id
 * @returns {Promise<UserDocument | null>}
 */
export const getIssue = async (id: string): Promise<IssueDocument | null> => {
  try {
    const issue = await Issue.findById(id);
    if (issue == null) return null;
    return issue;
  } catch (err) {
    return err;
  }
};

/**
 * @description getIssues fetches issues based on the parameters provided.
 * @param {string} project
 * @param {IssueState?} state
 * @param {IssueLabel?} label
 * @returns {Promise<UserDocument[]>}
 */
export const getIssues = async (project: string, state?: IssueState, label?: IssueLabel): Promise<IssueDocument[]> => {
  try {
    let issues: IssueDocument[];
    if (state === undefined && label === undefined) {
      issues = await Issue.find(({ project }));
    } else if (state === undefined) {
      issues = await Issue.find({ project, label });
    } else if (label === undefined) {
      issues = await Issue.find({ project, state });
    } else {
      issues = await Issue.find({ project, state, label });
    }
    if (issues.length === 0) return [];
    return issues;
  } catch (err) {
    return err;
  }
};

/**
 * @description createIssue creates an issue and adds it to the database.
 * @param {IssueDocument} issueDocument
 * @returns {Promise<UserDocument | null>}
 */
export const createIssue = async (issueDocument: IssueDocument): Promise<IssueDocument | null> => {
  try {
    const project = await Project.findOne({ name: issueDocument.project });
    if (project == null) throw new mongoose.Error("Project doesn't exist.");
    let issue = new Issue(issueDocument);
    issue = await issue.save();
    if (issue == null) return null;
    project.issueIds.push(issue.id);
    await project.save();
    return issue;
  } catch (err) {
    return err;
  }
};

/**
 * @description updateIssue updates an issue based on the partial document provided.
 * @param {Partial<IssueDocument>} updated
 * @returns {Promise<UserDocument | null>}
 */
export const updateIssue = async (updated: Partial<IssueDocument>): Promise<IssueDocument | null> => {
  try {
    if (updated.id === undefined) throw new Error('Id is undefined');

    const issue = await Issue.findById(updated.id);
    if (issue == null) return null;

    if (updated.label !== undefined) issue.label = updated.label;
    if (updated.state !== undefined) issue.state = updated.state;
    await issue.save();
    return issue;
  } catch (err) {
    return err;
  }
};
