import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/viva-dark/theme.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </>
);
