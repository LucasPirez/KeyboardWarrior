import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './TextToType.module.css';
import { serviceGame } from '../../services';

const t = `function prueba(){ 
    const hola = 3
    const tres = 4
    return hola + tres
}`;

export default function TextToType() {
  const refCurrentIndex = useRef({ index: 0 });
  const [currentChar, setCurrentChar] = useState<{
    letter: null | string;
    index: number;
  }>({ letter: null, index: -1 });
  const inputRef = useRef<HTMLTextAreaElement>(null!);
  const [wrongLetter, setWrongLetter] = useState(false);

  const [text, setText] = useState<{
    textRest: string;
    charToType: string;
    charTyped: string;
    textWithNormalSpace: string;
  }>({
    charToType: '',
    charTyped: '',
    textRest: '',
    textWithNormalSpace: '',
  });

  const handleInput = (event: FormEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    const lastLetter = value[value.length - 1];

    if (lastLetter === text?.charToType) {
      setWrongLetter(false);

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

  console.log(text);

  useEffect(() => {
    (async () => {
      const r = await serviceGame.getPruebaStringCode();

      setText(() => ({
        charTyped: '',
        charToType: r[0],
        textRest: r.substring(1),
        textWithNormalSpace: r
          .replace(/\s+/g, ' ')
          .replace('\n', '')
          .substring(1),
      }));
    })();
  }, []);

  return (
    <>
      {/* <Timer /> */}
      <div className={styles.container}>
        <textarea
          className={styles.inputHidden}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={() => inputRef?.current?.focus()}
          ref={inputRef}
          autoFocus></textarea>

        <div>
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
      </div>
    </>
  );
}
