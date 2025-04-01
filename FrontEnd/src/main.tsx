import ReactDOM from 'react-dom/client'
import App from './layout/App.tsx'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/viva-dark/theme.css'
import './layout/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </>
)
