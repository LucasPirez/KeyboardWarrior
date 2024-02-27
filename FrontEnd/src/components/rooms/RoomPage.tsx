import { ProgressBar } from 'primereact/progressbar';
import TextContainer from './TextContainer';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function RoomPage() {
  const [percentageState, setPercentageState] = useState(0);

  const handleSetPercentage = (percentage: number) => {
    setPercentageState(Math.floor(percentage));
  };
  return (
    <>
      <div>
        <h2>Room Id: #34245</h2>
        <Button label="Back to Rooms" />
        <section>
          <article>
            <div>
              <h3>player # 2</h3>
              <ProgressBar value={30} />
            </div>
            <div>
              <h3>player # 1</h3>
              <ProgressBar value={60} />
            </div>
            <div>
              <h3>player # 2</h3>
              <ProgressBar value={20} />
            </div>
            <div>
              <h3>player # 1</h3>
              <ProgressBar value={percentageState} />
            </div>
          </article>
          <TextContainer handleSetPercentage={handleSetPercentage} />
        </section>
      </div>
    </>
  );
}
