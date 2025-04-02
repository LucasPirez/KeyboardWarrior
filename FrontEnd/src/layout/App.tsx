import { Suspense, lazy, useEffect, useState } from 'react'
// import Login from '../components/login'
import { PATH, PathType } from '../constants/paths'
import { serviceGame } from '../services'
// import Home from '../pages/Home'
// import Room from '../pages/Room'
import { useLogin } from '../hooks/useLogin'
import { useUser } from '../hooks/useUser'
import { Layout } from '../components/Layout'
// import PracticeRoom from '../pages/PracticeRoom'
// import NotFoundPage from '../components/404-page'
// import ErrorComponent from '../components/error'
import { ErrorBoundary } from 'react-error-boundary'
import { SESSION_STORAGE } from '../constants'
import { removeSessionStorage, splitHashHelper } from '../helpers'
import { ProgressSpinner } from 'primereact/progressspinner'

const Room = lazy(() => import('../pages/Room'))
const Login = lazy(() => import('../pages/Login'))
const Home = lazy(() => import('../pages/Home'))
const PracticeRoom = lazy(() => import('../pages/PracticeRoom'))
const ErrorComponent = lazy(() => import('../components/error'))
const NotFoundPage = lazy(() => import('../components/404-page'))

function App() {
  const [currentPath, setCurrentPath] = useState<PathType | undefined>()
  const { login } = useLogin()
  const { userName } = useUser()

  const handleAuth = async () => {
    if (!userName) {
      window.location.hash = PATH.login
      setCurrentPath(PATH.login)
      return
    }

    try {
      await login(userName)
    } catch (error) {
      removeSessionStorage(SESSION_STORAGE)

      window.location.hash = PATH.login
      setCurrentPath(PATH.login)
      return
    }
  }

  useEffect(() => {
    /*eslint no-extra-semi: "off"*/
    if (window.location.hash === PATH.login) {
      setCurrentPath(PATH.login)
    }

    ;(async () => {
      const response = await serviceGame.connectGame()

      if (!response) {
        setCurrentPath(PATH.error)
        throw new Error('Error in socket connections')
      }

      await handleAuth()

      setCurrentPath(splitHashHelper(window.location.hash) as PathType)
    })()

    return () => {
      serviceGame.close()
    }
  }, [])

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(splitHashHelper(window.location.hash) as PathType)
    }
    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const pageToRender = {
    [PATH.game]: <Room />,
    [PATH.login]: <Login />,
    [PATH.rooms]: <Home />,
    [PATH.practice]: <PracticeRoom />,
    [PATH.error]: <ErrorComponent />,
  }

  const Component = (currentPath &&
    (pageToRender[currentPath] ? (
      pageToRender[currentPath]
    ) : (
      <NotFoundPage />
    ))) ?? (
    <div style={{ position: 'absolute', left: '45%', top: '30%' }}>
      <ProgressSpinner style={{ width: '120px', height: '120px' }} />
    </div>
  )

  return (
    <ErrorBoundary FallbackComponent={ErrorComponent}>
      <Suspense
        fallback={
          <ProgressSpinner
            style={{
              position: 'absolute',
              left: '45%',
              top: '30%',
              width: '120px',
              height: '120px',
            }}
          />
        }>
        <Layout>{Component}</Layout>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
