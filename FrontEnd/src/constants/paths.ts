export const PATH = {
  login: '/login',
  game: '/game',
  rooms: '/rooms',
  error: '/error',
} as const;

export type PathType = (typeof PATH)[keyof typeof PATH];
