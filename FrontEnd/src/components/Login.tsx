import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { PATH } from '../constants/paths';

import styles from './login.module.css';
import { serviceGame } from '../services';
import { SESSION_STORAGE } from '../constants/storage';

export default function Login() {
  const [value, setValue] = useState('');

  const handleLogin = async () => {
    try {
      const socketResponse = await serviceGame.login(value);

      if (!socketResponse) {
        alert('The userName is already exist');
        return;
      }
      window.sessionStorage.setItem(SESSION_STORAGE, value);
      window.location.hash = PATH.rooms;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className={styles.container}>
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
