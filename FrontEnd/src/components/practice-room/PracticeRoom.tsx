import { useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import ContainerTypingPractice from './ContainerTypingPractice';

import styles from './practice.module.css';

export default function PracticeRoom() {
  const [percenta, setPercenta] = useState(0);
  console.log(',hola');

  const handleSetPercentage = (value: number) => {
    setPercenta(value);
  };
  return (
    <>
      <h2 className={styles.title}>Practice</h2>
      <ProgressBar
        style={{
          height: '30px',
          minWidth: '200px',
          width: '400px',
        }}
        pt={{
          root: {
            style: { background: 'var(--gray-600)' },
          },
        }}
        value={percenta}
      />
      <ContainerTypingPractice
        handleSetPercentage={handleSetPercentage}
      />
    </>
  );
}
