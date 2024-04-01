import { useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import ContainerTypingPractice from './ContainerTypingPractice';

import styles from './practice.module.css';

export default function PracticeRoom() {
  const [percentage, setPercentage] = useState(0);

  const handleSetPercentage = (value: number) => {
    setPercentage(value);
  };

  return (
    <section className={styles.container}>
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
        value={percentage}
      />
      <ContainerTypingPractice
        handleSetPercentage={handleSetPercentage}
      />
    </section>
  );
}
