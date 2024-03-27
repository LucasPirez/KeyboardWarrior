import { useEffect, useState } from 'react';
import Login from './components/Login';
import { PATH, PathType } from './constants/paths';
import { serviceGame } from './services';
import Home from './components/Home';
import Father from './components/rooms/Father';
import { useLogin } from './hooks/useLogin';
import { useUser } from './hooks/useUser';
import { Layout } from './components/Layout';
import PracticeRoom from './components/practice-room/PracticeRoom';

function App() {
  const [currentPath, setCurrentPath] = useState<
    PathType | undefined
  >();
  const { login } = useLogin();
  const { userName } = useUser();

  const handleAuth = async () => {
    if (!userName) {
      console.log('if este no username');

      window.location.hash = PATH.login;
      setCurrentPath(PATH.login);
      return;
    }
  };

  const handleSplitHash = (hash: string) => {
    if (!hash.includes('#/')) {
      console.log('if este');

      window.location.hash = PATH.login;
      return '/login';
    }

    return hash.split('?')[0].replace('#', '');
  };

  useEffect(() => {
    (async () => {
      await handleAuth();
      const response = await serviceGame.connectGame();

      if (!response) {
        setCurrentPath(PATH.error);
        throw new Error('Error in socket connections');
      }
      userName && (await login(userName));

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
    [PATH.error]: <h1>some error has ocurred</h1>,
  };

  const Component = currentPath ? (
    pageToRender[currentPath]
  ) : (
    <h2>leading</h2>
  );

  return <Layout>{Component}</Layout>;
}

export default App;
