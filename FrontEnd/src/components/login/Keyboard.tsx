import { keyboardLetters } from '../../constants';
import { Char } from './Char';

interface Props {
  activeKey: Record<string, boolean>;
}

export default function Keyboard({ activeKey }: Props) {
  return (
    <>
      {keyboardLetters.map((uniqueKey) => {
        const char =
          typeof uniqueKey === 'string' ? uniqueKey : uniqueKey[0];
        const symbol =
          typeof uniqueKey !== 'string' ? uniqueKey[1] : undefined;
        return (
          <Char
            char={char}
            press={activeKey[uniqueKey as string]}
            symbol={symbol}
          />
        );
      })}
    </>
  );
}
