import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useRef, useState } from 'react';
import { PATH } from '../../constants/paths';
import styles from './login.module.css';
import click from '../../assets/click.mp3';
import spaceClick from '../../assets/spacebar.mp3';
import { useLogin } from '../../hooks/useLogin';
import FakeTyping from './FakeTyping';
import sound from '../../assets/bocina.png';
import { TEXT_LOGIN } from '../../constants';
import Keyboard from './Keyboard';

export function Login() {
  const [value, setValue] = useState('');
  const [activeChar, setActiveChar] = useState<
    Record<string, boolean>
  >({});
  const soundRef = useRef<boolean>(false);

  useEffect(() => {
    if (soundRef.current) {
      const newAudio = new Audio();

      if (activeChar['Space'] !== undefined) {
        newAudio.src = spaceClick;
        newAudio.play();
      } else {
        newAudio.src = click;
        newAudio.play();
      }
    }
  }, [activeChar]);

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
      <div className={styles.subContainer}>
        <div className={styles.containerTextLogin}>
          <div className={styles.containerText}>
            <FakeTyping
              className={styles.spanText}
              textFake={TEXT_LOGIN}
              setActiveChar={setActiveChar}
            />
          </div>{' '}
          <div className={styles.containerLogin}>
            <button
              onClick={() => (soundRef.current = !soundRef.current)}
              className={styles.bocina}>
              <img
                src={sound}
                className={`${!soundRef.current && styles.silence}`}
              />
            </button>
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
        </div>

        <div className={styles.keyboardContainer}>
          <Keyboard activeKey={activeChar} />
        </div>
      </div>
    </section>
  );
}
