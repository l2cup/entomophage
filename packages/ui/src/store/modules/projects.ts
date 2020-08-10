import {
  getModule,
  Module,
  MutationAction,
  VuexModule,
  Action,
} from 'vuex-module-decorators';
import { ProjectModel } from '@entomophage/common/src';
import store from '..';
import { issuesApi } from '../api';
import { ProjectsState } from './states';

@Module({
  namespaced: true,
  name: 'projects',
  store,
  dynamic: true,
})
class Projects extends VuexModule implements ProjectsState {
  projects: ProjectModel[] = []

  detailed: ProjectModel | null = null

  @MutationAction({ mutate: ['projects'] })
  async fetch(author: string) {
    this.projects = await issuesApi.fetchProjects(author);
    return { projects: this.projects };
  }

  @Action
  async new(model: ProjectModel) {
    await issuesApi.postProject(model);
  }

  @MutationAction({ mutate: ['projects'] })
  async update(model: ProjectModel) {
    const project = await issuesApi.putProject(model);
    if (project != null) {
      this.projects = await issuesApi.fetchProjects(project.author);
    }
    return { projects: this.projects };
  }

  @MutationAction({ mutate: ['detailed'] })
  async fetchDetails(name: string) {
    this.detailed = await issuesApi.fetchProject(name);
    return { detailed: this.detailed };
  }
}

const ProjectsModule = getModule(Projects);
export default ProjectsModule;
