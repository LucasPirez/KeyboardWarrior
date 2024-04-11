import { FormEvent, useEffect, useRef, useState } from 'react';
import styles from './WritingVisualization.module.css';
import { replaceTextSpaceHelper } from '../helpers';

interface Props {
  textReceived: string;
  handleSetPercentage: (percentage: number) => void;
  isInactive?: number;
  intervalPercentage?: (percentage: number) => void;
  finish?: () => void;
  inactiveUser?: () => Promise<void>;
  handleError?: () => void;
}

export default function WritingVisualization({
  textReceived,
  handleSetPercentage,
  isInactive,
  intervalPercentage,
  finish,
  inactiveUser,
  handleError,
}: Props) {
  const [text, setText] = useState<{
    textRest: string;
    charToType: string;
    charTyped: string;
    textWithNormalSpace: string;
  }>({
    charTyped: '',
    charToType: textReceived[0],
    textRest: textReceived.substring(1),
    textWithNormalSpace: replaceTextSpaceHelper(textReceived),
  });

  const refPercentage = useRef<{ value: number }>({ value: 0 });
  const refInterval = useRef<{ value: number }>({ value: 0 });
  const userInteraction = useRef<{
    lastIndexTyped: number;
    seconds: number;
  }>({
    lastIndexTyped: 0,
    seconds: 0,
  });
  const refCurrentIndex = useRef({ index: 0 });
  const [wrongLetter, setWrongLetter] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null!);

  const setPercentage = () => {
    let percentage;

    if (
      refCurrentIndex.current.index >= text.textWithNormalSpace.length
    ) {
      percentage = 100;
    } else {
      percentage = Math.floor(
        (refCurrentIndex.current.index * 100) /
          text.textWithNormalSpace.length
      );
    }

    refPercentage.current.value = percentage;
    handleSetPercentage(percentage);
  };

  const handleInput = (event: FormEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    const lastLetter = value[value.length - 1];

    if (lastLetter === text?.charToType) {
      if (lastLetter === '\n') {
        setWrongLetter(false);
        setPercentage();

        const nextChar =
          text.textWithNormalSpace[refCurrentIndex.current.index];
        const nextIndex = text.textRest.indexOf(nextChar);

        setText((prev) => ({
          ...prev,
          charTyped: prev.charTyped + `\n` + ' '.repeat(nextIndex),
          charToType: nextChar,
          textRest: prev.textRest.substring(nextIndex + 1),
        }));

        refCurrentIndex.current.index++;
      } else {
        setWrongLetter(false);
        setPercentage();

        refCurrentIndex.current.index++;
        setText((prev) => ({
          ...prev,
          charTyped: prev.charTyped + lastLetter,
          charToType: prev.textRest[0],
          textRest: prev.textRest.substring(1),
        }));
      }
    } else {
      setWrongLetter(true);
      handleError && handleError();
    }
  };

  useEffect(() => {
    if (intervalPercentage || finish || inactiveUser)
      refInterval.current.value = setInterval(() => {
        intervalPercentage &&
          intervalPercentage(refPercentage?.current.value ?? 0);

        if (refPercentage?.current.value === 100) {
          clearInterval(refInterval.current.value);

          finish && finish();
        }

        if (
          userInteraction.current.lastIndexTyped ===
          refCurrentIndex.current.index
        ) {
          userInteraction.current.seconds++;
        } else {
          userInteraction.current.lastIndexTyped =
            refCurrentIndex.current.index;
          userInteraction.current.seconds = 0;
        }

        if (
          isInactive &&
          userInteraction.current.seconds >= isInactive
        ) {
          (async () => {
            try {
              // handleSetUserEnd(userName ?? '');
              inactiveUser && (await inactiveUser());
            } catch (error) {
              alert(error);
            }
          })();
        }
      }, 1000);

    return () => {
      clearInterval(refInterval.current.value);
    };
  }, []);

  return (
    <>
      <div className={styles.container}>
        <textarea
          className={styles.inputHidden}
          onInput={handleInput}
          onBlur={() => inputRef?.current?.focus()}
          ref={inputRef}
          autoFocus></textarea>

        <pre className={styles.prev}>
          <code>
            {text ? (
              <>
                <span className={styles.textTyped}>
                  {text.charTyped}
                </span>
                <span
                  className={` ${styles.indicator}
                ${wrongLetter ? styles.indicatorWrong : ''}
                ${
                  text.charToType === '\n'
                    ? !wrongLetter
                      ? styles.space
                      : styles.spaceWrong
                    : ''
                } `}>
                  {text.charToType}
                </span>
                <span className={styles.textToType}>
                  {text.textRest}
                </span>
              </>
            ) : (
              ''
            )}
          </code>
        </pre>
      </div>
    </>
  );
}
