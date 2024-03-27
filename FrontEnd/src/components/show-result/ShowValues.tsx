import { COLORS_SHOW_VALUES } from '../../constants';
import styles from './showValues.module.css';

interface Props {
  valueName: string;
  value: string;
  color: COLORS_SHOW_VALUES;
}

export default function ShowValues({
  valueName,
  value,
  color,
}: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.valueName}>{valueName}</span>
      <span
        className={
          color === COLORS_SHOW_VALUES.GOOD_VALUE
            ? styles.value
            : styles.wrongValue
        }>
        {value}
      </span>
    </div>
  );
}
