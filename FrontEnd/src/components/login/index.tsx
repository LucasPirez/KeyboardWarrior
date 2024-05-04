import { useEffect, useRef, useState } from 'react';
import Keyboard from './Keyboard';
import styles from './index.module.css';
import { useUser } from '../../hooks/useUser';
import { navigateTo } from '../../helpers';
import FakeTyping from './FakeTyping';
import { TEXT_LOGIN } from '../../constants';
import spaceClick from '../../assets/spacebar.mp3';
import click from '../../assets/click.mp3';
import sound from '../../assets/bocina.png';
import { Login } from './Login';

export default function LoginPage() {
  const [activeChar, setActiveChar] = useState<
    Record<string, boolean>
  >({});
  const soundRef = useRef<boolean>(false);
  const { userName } = useUser();

  useEffect(() => {
    if (userName)
      navigateTo({
        path: '/rooms',
      });

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
          </div>

          <div className={styles.containerLogin}>
            <button
              onClick={() => (soundRef.current = !soundRef.current)}
              className={styles.bocina}>
              <img
                src={sound}
                className={`${!soundRef.current && styles.silence}`}
              />
            </button>
            <Login />
          </div>
        </div>
        <Keyboard activeKey={activeChar} />
      </div>
    </section>
  );
}
