import { useEffect, useState } from 'react';

interface Props {
  finish?: () => void;
}

export default function Timer({ finish }: Props) {
  const [timer, setTimer] = useState(5);

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
      <span>{timer}</span>
    </div>
  );
}
