import { SESSION_STORAGE } from '../constants';
import { serviceGame } from '../services';

export const useLogin = (): {
  login: (userName: string) => Promise<boolean>;
} => {
  async function login(userName: string) {
    try {
      const socketResponse = await serviceGame.login(userName);

      if (!socketResponse) {
        return false;
      }
      window.sessionStorage.setItem(SESSION_STORAGE, userName);
      return true;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  return {
    login,
  };
};
