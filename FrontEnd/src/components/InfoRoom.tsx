import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function Room() {
  return (
    <>
      <Card
        style={{
          width: '250px',
          height: '250px',
        }}
        title="roomID">
        <p>Count players: 0</p>
        <Button label="Join to Room" raised />
      </Card>
    </>
  );
}
