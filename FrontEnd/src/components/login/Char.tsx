import { memo } from 'react';
import styles from './keyboard.module.css';

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
          ? `${styles[char as keyof typeof styles]}  ${
              styles.onlyOneChar
            }`
          : styles[symbol as keyof typeof styles]
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
