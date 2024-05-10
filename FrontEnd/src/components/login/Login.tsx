import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { PATH } from '../../constants/paths';
import styles from './login.module.css';
import { useLogin } from '../../hooks/useLogin';
import ErrorComponent from '../error';

export function Login() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login } = useLogin();

  const handleLogin = async () => {
    try {
      setError(null);

      const result = await login(value);

      if (result) {
        window.location.hash = PATH.rooms;
      }
    } catch (error) {
      if (typeof error === 'string') setError(error);
      else if (error instanceof Error) setError(error.message);
    }
  };

  return (
    <>
      {error ? <ErrorComponent error={error} /> : ''}
      <InputText
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="UserName"
        minLength={4}
        className={styles.elements}
      />
      <Button
        label="Join"
        outlined
        className={styles.elements}
        onClick={handleLogin}
        disabled={value.length < 4}
      />
    </>
  );
}
