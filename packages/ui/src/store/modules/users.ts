import {
  getModule,
  Module,
  MutationAction,
  VuexModule,
} from 'vuex-module-decorators';
import { UserModel } from '@entomophage/common';
import store from '..';
import { userApi } from '../api';
import { UserState } from './states';

@Module({
  namespaced: true,
  name: 'users',
  store,
  dynamic: true,
  preserveState: localStorage.getItem('vuex') != null,
})
class User extends VuexModule implements UserState {
  user: UserModel | null = null

  visitingUser: UserModel | null = null

  @MutationAction({ mutate: ['user'] })
  async login(req: userApi.UserRequest) {
    this.user = await userApi.login(req);
    return { user: this.user };
  }

  @MutationAction({ mutate: ['user'] })
  async register(req: userApi.UserRequest) {
    this.user = await userApi.register(req);
    return { user: this.user };
  }

  @MutationAction({ mutate: ['user'] })
  async logout() {
    userApi.clearJWT();
    this.user = null;
    return { user: this.user };
  }

  @MutationAction({ mutate: ['user'] })
  async update(updatedModel: UserModel) {
    const updated = await userApi.updateUser(updatedModel);
    if (updated != null) this.user = updated;
    return { user: this.user };
  }

  @MutationAction({ mutate: ['visitingUser'] })
  async fetch(username: string) {
    this.visitingUser = await userApi.fetchUser(username);
    return { visitingUser: this.visitingUser };
  }
}

const UserModule = getModule(User);
export default UserModule;
