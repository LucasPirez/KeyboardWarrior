import { BackToRooms } from '../buttons';
import styles from './index.module.css';

export default function NotFoundPage() {
  return (
    <>
      <section className={styles.container}>
        <div className={styles.subContainer}>
          <span className={styles.number}>404</span>
          <span className={styles.description}>
            We couldn't find <br />
            this page.
          </span>
        </div>
        <BackToRooms />
      </section>
    </>
  );
}
