import { useEffect, useState } from 'react';

interface Props {
  className: string;
  textFake: string;
  setActiveChar: (char: Record<string, boolean>) => void;
}

export default function FakeTyping({
  className,
  textFake,
  setActiveChar,
}: Props) {
  const [text, setText] = useState('');

  useEffect(() => {
    setTimeout(() => {
      (async () => {
        for (let i = 0; i < textFake.length; i++) {
          const p = new Promise<void>((resolve) => {
            setTimeout(() => {
              setText((prev) => prev + textFake[i]);
              const letter =
                textFake[i] === ' '
                  ? 'Space'
                  : textFake[i].toLowerCase();

              setActiveChar({ [letter]: true });

              resolve();
            }, 150 + Math.round(Math.random() * 100));
          });
          await p;
        }

        setActiveChar({ ['null']: true });
      })();
    }, 1000);
  }, []); // eslint-disable-line

  return (
    <>
      <span className={className}>{text}</span>
    </>
  );
}
