import { useEffect, useState } from 'react';
import Login from './components/login';
import { PATH, PathType } from './constants/paths';
import { serviceGame } from './services';
import Home from './components/Home';
import Father from './components/rooms/Father';
import { useLogin } from './hooks/useLogin';
import { useUser } from './hooks/useUser';
import { Layout } from './components/Layout';
import PracticeRoom from './components/practice-room/PracticeRoom';
import NotFoundPage from './components/404-page';
import ErrorComponent from './components/error';

import { ErrorBoundary } from 'react-error-boundary';
import { SESSION_STORAGE } from './constants';
import { removeSessionStorage } from './helpers';

function App() {
  const [currentPath, setCurrentPath] = useState<
    PathType | undefined
  >();
  const { login } = useLogin();
  const { userName } = useUser();

  const handleAuth = async () => {
    if (!userName) {
      window.location.hash = PATH.login;
      setCurrentPath(PATH.login);
      return;
    }

    try {
      await login(userName);
    } catch (error) {
      removeSessionStorage(SESSION_STORAGE);

      window.location.hash = PATH.login;
      setCurrentPath(PATH.login);
      return;
    }
  };

  const handleSplitHash = (hash: string) => {
    if (!hash.includes('#/')) {
      window.location.hash = PATH.login;
      return PATH.login;
    }

    return hash.split('?')[0].replace('#', '');
  };

  useEffect(() => {
    (async () => {
      const response = await serviceGame.connectGame();

      if (!response) {
        setCurrentPath(PATH.error);
        throw new Error('Error in socket connections');
      }

      await handleAuth();

      setCurrentPath(
        handleSplitHash(window.location.hash) as PathType
      );
    })();

    return () => {
      serviceGame.close();
    };
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(
        handleSplitHash(window.location.hash) as PathType
      );
    };
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const pageToRender = {
    [PATH.game]: <Father />,
    [PATH.login]: <Login />,
    [PATH.rooms]: <Home />,
    [PATH.practice]: <PracticeRoom />,
    [PATH.error]: <ErrorComponent />,
  };

  const Component =
    currentPath && pageToRender[currentPath] ? (
      pageToRender[currentPath]
    ) : (
      <NotFoundPage />
    );

  return (
    <ErrorBoundary FallbackComponent={ErrorComponent}>
      <Layout>{Component}</Layout>
    </ErrorBoundary>
  );
}

export default App;
