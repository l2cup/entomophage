import { UserModel } from '@entomophage/common';
import gatewayApi from './gateway';

export type UserRequest = {
  username: string;
  email? : string;
  password: string;
}

export type TeamRequest = {

}

export const setJWT = (jwt: string): void => {
  gatewayApi.defaults.headers.common['x-jwt-token'] = `${jwt}`;
  localStorage.setItem('jwt', jwt);
};

export const clearJWT = (): void => {
  delete gatewayApi.defaults.headers.common['x-jwt-token'];
  localStorage.removeItem('jwt');
};

export const getJWT = async (): Promise<string> => gatewayApi.defaults.headers.common['x-jwt-token'];

export const login = async (req: UserRequest): Promise<UserModel | null> => {
  try {
    const response = await gatewayApi.post('/login', { username: req.username, password: req.password });
    if (response.data.authorization !== undefined
      && response.data.authorization === true
    && response.data.user !== undefined) {
      setJWT(response.data.token);
      return response.data.user as UserModel;
    }
    return null;
  } catch (err) {
    console.error(`[USER_API]:register - ${err}`);
    return null;
  }
};

export const register = async (req: UserRequest): Promise<UserModel | null> => {
  try {
    const response = await gatewayApi.post('/register', { username: req.username, password: req.password, email: req.email });
    if (response.data.user !== undefined) {
    // setJWT(response.data.token);
      return response.data.user as UserModel;
    }
    return null;
  } catch (err) {
    console.error(`[USER_API]:register - ${err}`);
    return null;
  }
};

export const fetchUser = async (username: string): Promise<UserModel | null> => {
  try {
    const response = await gatewayApi.get(`user/?username=${username}`);
    if (response.status === 200) {
      return response.data as UserModel;
    }
    return null;
  } catch (err) {
    console.error(`[USER_API]:fetchUser - ${err}`);
    return null;
  }
};

export const updateUser = async (user: UserModel): Promise<UserModel | null> => {
  try {
    const response = await gatewayApi.put('user', { username: user.username, email: user.email, profile: user.profile });
    return response.data as UserModel;
  } catch (err) {
    console.error(`[USER_API]:updateUser - ${err}`);
    return null;
  }
};

// export const createTeam = async (req: TeamRequest): Promise<TeamModel | null> => null;
