import { SESSION_STORAGE } from '../constants';

const useUser = () => {
  const userName = window.sessionStorage.getItem(SESSION_STORAGE);

  return {
    userName,
  };
};

export { useUser };
