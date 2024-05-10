import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';

interface Props {
  error?: unknown;
}

export default function ErrorComponent({ error }: Props) {
  const toast = useRef<Toast>(null);
  console.log(error);

  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
      ? error.message
      : 'Some error has ocurred.';

  useEffect(() => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: <strong>{message}</strong>,
      life: 3000,
    });
  }, []);

  return (
    <>
      <Toast ref={toast} />
    </>
  );
}
