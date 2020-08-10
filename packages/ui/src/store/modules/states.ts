import { UserModel, ProjectModel, IssueModel } from '@entomophage/common';

export interface UserState {
  user: UserModel | null;
  visitingUser: UserModel | null;
}

export interface ProjectsState {
   projects: ProjectModel[];
   detailed: ProjectModel | null;
}

export interface IssueState {
  issues: IssueModel[];
}
