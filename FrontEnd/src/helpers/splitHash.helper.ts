import { PATH } from '../constants';

export function splitHashHelper(hash: string) {
  if (!hash.includes('#/')) {
    window.location.hash = PATH.login;
    return PATH.login;
  }

  return hash.split('?')[0].replace('#', '');
}
