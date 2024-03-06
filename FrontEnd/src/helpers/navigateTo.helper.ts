import { PATH } from '../constants';

interface Props {
  path: (typeof PATH)[keyof typeof PATH];
  query?: Record<string, string>;
}

const navigateTo = ({ path, query }: Props) => {
  const queryParams = query
    ? Object.entries(query)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&')
    : '';

  const url = `${window.location.origin}/#${path}${
    queryParams ? `?${queryParams}` : ''
  }`;

  window.location.href = url;
};

export { navigateTo };
