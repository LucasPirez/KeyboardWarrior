import { useEffect, useState } from 'react';
import styles from './timer.module.css';

interface Props {
  finish?: () => void;
}

export default function Timer({ finish }: Props) {
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    const inter = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    if (timer === 0) {
      finish && finish();
      window.clearInterval(inter);
    }

    return () => {
      window.clearInterval(inter);
    };
  }, [timer]);

  return (
    <div>
      <span className={styles.timer}>{timer}</span>
    </div>
  );
}
