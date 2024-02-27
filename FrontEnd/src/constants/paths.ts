export const PATH = {
  login: '/login',
  game: '/game',
  rooms: '/rooms',
} as const;

export type PathType = (typeof PATH)[keyof typeof PATH];
