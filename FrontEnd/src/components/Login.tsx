import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { PATH } from '../constants/paths';
import styles from './login.module.css';
import { useLogin } from '../hooks/useLogin';
import keyboard from '../assets/keyboard-png.jpg';

export default function Login() {
  const [value, setValue] = useState('');
  const { login } = useLogin();

  const handleLogin = async () => {
    try {
      const result = await login(value);

      if (result) {
        window.location.hash = PATH.rooms;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className={styles.container}>
      <img src={keyboard} className={styles.img} />
      <div className={styles.subContainer}>
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
      </div>
    </section>
  );
}
