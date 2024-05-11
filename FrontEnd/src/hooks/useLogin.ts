import { setSessionStorage } from '../helpers';
import { SESSION_STORAGE } from '../constants';
import { serviceGame } from '../services';

export const useLogin = (): {
  login: (userName: string) => Promise<boolean>;
} => {
  async function login(userName: string) {
    await serviceGame.login(userName);

    setSessionStorage(SESSION_STORAGE, userName);
    return true;
  }

  return {
    login,
  };
};
