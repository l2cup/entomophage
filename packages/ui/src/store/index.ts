import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import { UserState, ProjectsState } from './modules/states';

Vue.use(Vuex);

const VuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage,
});

export interface RootState {
  users: UserState;
  projects: ProjectsState;
}

export default new Vuex.Store<RootState>({
  plugins: [VuexLocal.plugin],
});
