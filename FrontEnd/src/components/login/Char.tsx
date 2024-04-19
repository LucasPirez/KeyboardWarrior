import { memo } from 'react';
import styles from './login.module.css';

interface Props {
  symbol?: string;
  char: string;
  press: boolean;
}

const Char = memo(function Char({ char, press, symbol }: Props) {
  const isSlash = char === '\\';

  return (
    <div
      key={String(char) + Math.random()}
      className={`${styles.keyContainer} ${
        !symbol
          ? `${styles[char]}  ${styles.onlyOneChar}`
          : styles[symbol]
      }
      } ${press ? styles.activeKey : ''} ${isSlash && styles.Slash}`}>
      {!symbol ? (
        <span>{char}</span>
      ) : (
        <>
          {symbol}
          <br />
          {char}
        </>
      )}
    </div>
  );
});

export { Char };
