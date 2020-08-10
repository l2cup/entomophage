import {
  ProjectModel, IssueModel, IssueState, IssueLabel,
} from '@entomophage/common';
import gatewayApi from './gateway';

export const putProject = async (project: Partial<ProjectModel>): Promise<ProjectModel | null> => {
  try {
    const response = await gatewayApi.put('/project', project);
    if (response.data !== undefined) {
      return response.data as ProjectModel;
    }
    return null;
  } catch (err) {
    console.error(`[ISSUES_API]:putProject - ${err}`);
    return null;
  }
};

export const postProject = async (model: ProjectModel): Promise<ProjectModel | null> => {
  try {
    console.log(model);
    const response = await gatewayApi.post('/project', model);
    if (response.data !== undefined) {
      return response.data as ProjectModel;
    }
    return null;
  } catch (err) {
    console.error(`[ISSUES_API]:postProject - ${err}`);
    return null;
  }
};

export const fetchProject = async (name: string): Promise<ProjectModel | null > => {
  try {
    const response = await gatewayApi.get(`/project/?name=${name}`);
    if (response.data !== undefined) return response.data as ProjectModel;
    return null;
  } catch (err) {
    console.error(`[ISSUES_API]:fetchProject - ${err}`);
    return null;
  }
};

export const fetchProjects = async (author: string): Promise<ProjectModel[]> => {
  try {
    const response = await gatewayApi.get(`/projects/?author=${author}`);
    if (response.data !== undefined) return response.data as ProjectModel[];
    return [];
  } catch (err) {
    console.error(`[ISSUES_API]:fetchProjects - ${err}`);
    return [];
  }
};

export const fetchIssues = async (project: string, state?: IssueState, label?: IssueLabel): Promise<IssueModel[]> => {
  try {
    const params = {
      project,
      state,
      label,
    };
    const response = await gatewayApi.get('issues', { params });
    if (response.data !== undefined) return response.data as IssueModel[];
    return [];
  } catch (err) {
    return [];
  }
};

export const putIssue = async (issue: Partial<IssueModel & {id: string; _id: string}>): Promise<IssueModel | null> => {
  try {
    // eslint-disable-next-line
    if (issue._id != null) issue.id = issue._id;
    const response = await gatewayApi.put('/issue', issue);
    if (response.data !== undefined) {
      return response.data as IssueModel;
    }
    return null;
  } catch (err) {
    console.error(`[ISSUES_API]:putIssue - ${err}`);
    return null;
  }
};

export const postIssue = async (issue: Partial<IssueModel>): Promise<IssueModel | null> => {
  try {
    const response = await gatewayApi.post('/issue', issue);
    if (response.data !== undefined) {
      return response.data as IssueModel;
    }
    return null;
  } catch (err) {
    console.error(`[ISSUES_API]:postIssue - ${err}`);
    return null;
  }
};
