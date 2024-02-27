import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { PATH } from '../constants/paths';

export default function Login() {
  const [value, setValue] = useState('');

  return (
    <section>
      <InputText
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="UserName"
      />
      <Button
        label="Join"
        outlined
        onClick={() => {
          window.location.hash = PATH.rooms;
        }}
      />
    </section>
  );
}
