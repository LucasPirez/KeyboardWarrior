import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './TextToType.module.css';
import { SESSION_STORAGE } from '../../constants';
import { serviceGame } from '../../services';
import { type Room } from '../../type';

interface Props {
  room: Room & { text: string };
  handleSetPercentage: (value: number) => void;
}

export default function TextToType({
  room,
  handleSetPercentage,
}: Props) {
  const { text: textReceived, id } = room;
  const [text, setText] = useState<{
    textRest: string;
    charToType: string;
    charTyped: string;
    textWithNormalSpace: string;
  }>({
    charTyped: '',
    charToType: textReceived[0],
    textRest: textReceived.substring(1),
    textWithNormalSpace: textReceived
      .replace(/\s+/g, ' ')
      .replace('\n', '')
      .substring(1),
  });
  const [wrongLetter, setWrongLetter] = useState(false);

  const refCurrentIndex = useRef({ index: 0 });

  const refPercentage = useRef<{ value: number }>({ value: 0 });
  const refInterval = useRef<{ value: number }>({ value: 0 });
  const inputRef = useRef<HTMLTextAreaElement>(null!);

  const setPercentage = () => {
    const percentage = Math.ceil(
      (refCurrentIndex.current.index * 100) /
        text.textWithNormalSpace.length
    );

    refPercentage.current.value = percentage;
    handleSetPercentage(percentage);
  };

  const handleInput = (event: FormEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    const lastLetter = value[value.length - 1];

    if (lastLetter === text?.charToType) {
      setWrongLetter(false);
      setPercentage();

      refCurrentIndex.current.index++;
      setText((prev) => ({
        ...prev,
        charTyped: prev.charTyped + lastLetter,
        charToType: prev.textRest[0],
        textRest: prev.textRest.substring(1),
      }));
    } else {
      setWrongLetter(true);
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const { code } = event;

    if (code === 'Enter' && text.charToType === '\n') {
      setWrongLetter(false);
      setPercentage();

      const nextChar =
        text.textWithNormalSpace[refCurrentIndex.current.index];
      const nextIndex = text.textRest.indexOf(nextChar);

      setText((prev) => ({
        ...prev,
        charTyped: prev.charTyped + `\n   `,
        charToType: nextChar,
        textRest: prev.textRest.substring(nextIndex + 1),
      }));

      refCurrentIndex.current.index++;
    } else {
      setWrongLetter(true);
    }
  };

  const userName = window.sessionStorage.getItem(SESSION_STORAGE);

  useEffect(() => {
    refInterval.current.value = setInterval(() => {
      serviceGame.percentageTyped(
        refPercentage.current?.value ?? 0,
        userName ?? '',
        id ?? ''
      );
      if (refPercentage.current?.value === 100) {
        clearInterval(refInterval.current.value);
        serviceGame.finishGame({
          userName: userName ?? '',
          roomId: room.id,
        });
      }
    }, 1000);

    return () => {
      clearInterval(refInterval.current.value);
    };
  }, []);

  return (
    <>
      {/* <Timer /> */}
      <div className={styles.container}>
        <textarea
          className={styles.inputHidden}
          onInput={handleInput}
          onBlur={() => inputRef?.current?.focus()}
          ref={inputRef}
          onKeyDown={handleKeyDown}
          autoFocus></textarea>
        <pre>
          <code>
            <span style={{ color: 'navy' }}>
              {text && text.charTyped}
            </span>
            <span
              style={{
                background: `${
                  wrongLetter ? 'red' : 'var(--primary-color)'
                }`,
              }}
              className={`${
                text.charToType === '\n' ? styles.space : ''
              }`}>
              {text && text.charToType}
            </span>
            {text && text.textRest}
          </code>
        </pre>
      </div>
    </>
  );
}
