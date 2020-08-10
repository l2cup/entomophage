import {
  getModule,
  Module,
  MutationAction,
  VuexModule,
} from 'vuex-module-decorators';
import { IssueModel, IssueState as IssueStateEnum, IssueLabel } from '@entomophage/common/src';
import store from '..';
import { issuesApi } from '../api';
import { IssueState } from './states';

@Module({
  namespaced: true,
  name: 'issues',
  store,
  dynamic: true,
})
class Issues extends VuexModule implements IssueState {
  issues: IssueModel[] = []

  @MutationAction({ mutate: ['issues'] })
  async fetch(project: string, state?: IssueStateEnum, label?: IssueLabel) {
    this.issues = await issuesApi.fetchIssues(project, state, label);
    return { issues: this.issues };
  }

  @MutationAction({ mutate: ['issues'] })
  async new(issue: IssueModel) {
    const newIssue = await issuesApi.postIssue(issue);
    if (newIssue !== undefined) {
      this.issues = await issuesApi.fetchIssues(issue.project);
    }
    return { issues: this.issues };
  }

  @MutationAction({ mutate: ['issues'] })
  async update(issue: IssueModel) {
    const updatedIssue = await issuesApi.putIssue(issue);
    if (updatedIssue !== undefined) {
      this.issues = await issuesApi.fetchIssues(issue.project);
    }
    return { issues: this.issues };
  }
}

const IssuesModule = getModule(Issues);
export default IssuesModule;
