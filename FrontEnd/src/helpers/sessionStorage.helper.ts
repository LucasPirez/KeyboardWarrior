import { SessionStorageType, User } from '../type';

export function getSessionStorage(
  storageName: SessionStorageType
): string | null {
  return window.sessionStorage.getItem(storageName);
}

export function setSessionStorage(
  storageName: SessionStorageType,
  value: string | User
) {
  if (typeof value === 'string') {
    window.sessionStorage.setItem(storageName, value);
  } else if (value.id && value.userName) {
    const newValueStorage = JSON.stringify(value);

    window.sessionStorage.setItem(storageName, newValueStorage);
  }
}

export function removeSessionStorage(
  storageName: SessionStorageType
) {
  window.sessionStorage.removeItem(storageName);
}
