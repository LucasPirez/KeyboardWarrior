import styles from './index.module.css';

export default function Header() {
  const title = window.location.hash.includes('practice')
    ? 'Practice'
    : 'SpeedyType';

  return (
    <header className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}
