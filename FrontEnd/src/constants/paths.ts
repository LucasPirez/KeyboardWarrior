export const PATH = {
  login: '/login',
  game: '/game',
  rooms: '/rooms',
  practice: '/practice',
  error: '/error',
} as const;

export type PathType = (typeof PATH)[keyof typeof PATH];
