import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface Props {
  message?: string;
}

export default function Error({ message }: Props) {
  const toast = useRef<Toast>(null);

  setTimeout(() => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message ?? 'Some error has ocurred.',
      life: 3000,
    });
  }, 200);

  return (
    <>
      <Toast ref={toast} />
    </>
  );
}
