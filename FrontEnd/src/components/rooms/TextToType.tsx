import { FormEvent, useRef, useState } from 'react';
import styles from './TextToType.module.css';

interface Props {
  text?: string;
  handleSetPercentage: (percentage: number) => void;
}

export default function TextToType({
  text = 'Lorem ipsum dolor master de los americanos aguante maxi y alguna SMITH ya se la va a poner',
  handleSetPercentage,
}: Props) {
  const textLong = useRef(text.length);
  const refLetters = useRef({ index: 0 });
  const [currentChar, setCurrentChar] = useState<{
    letter: null | string;
    index: number;
  }>({ letter: null, index: -1 });

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const lastLetter = value[value.length - 1];

    if (lastLetter === text[refLetters.current.index]) {
      setCurrentChar({
        index: refLetters.current.index,
        letter: lastLetter,
      });
      ++refLetters.current.index;
    } else {
      setCurrentChar({
        index: refLetters.current.index,
        letter: lastLetter,
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <input
          type="text"
          className={styles.inputHidden}
          onInput={handleInput}
          autoFocus
        />
        {text.split('').map((charText, textIndex) => {
          let classString;
          if (currentChar.index > textIndex) {
            classString = styles.correctLetter;
          } else if (currentChar.index === textIndex) {
            handleSetPercentage(
              (currentChar.index * 100) / textLong.current
            );
            classString =
              currentChar.letter === charText
                ? styles.correctLetter
                : styles.incorrectLetter;
          }

          return (
            <span
              key={textIndex + '' + Math.random()}
              className={classString}>
              {charText === ' ' ? (
                <span className={styles.span}>-</span>
              ) : (
                charText
              )}
            </span>
          );
        })}
      </div>
    </>
  );
}
