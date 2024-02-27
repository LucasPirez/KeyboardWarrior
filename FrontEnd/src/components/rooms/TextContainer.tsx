import { ToggleButton } from 'primereact/togglebutton';
import styles from './textContainer.module.css';
import { useState } from 'react';
import TextToType from './TextToType';

interface Props {
  handleSetPercentage: (percetage: number) => void;
}

export default function TextContainer({
  handleSetPercentage,
}: Props) {
  const [toggleButton, setToggleButton] = useState(false);
  return (
    <article className={styles.container}>
      <ToggleButton
        onLabel="I Ready"
        offLabel="I Not Ready"
        checked={toggleButton}
        onChange={(e) => setToggleButton(e.value)}
      />
      {toggleButton && (
        <TextToType handleSetPercentage={handleSetPercentage} />
      )}
    </article>
  );
}
