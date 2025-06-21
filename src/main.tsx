
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/premium.css'
import './index.css'
import './styles/premium-override.css'

createRoot(document.getElementById("root")!).render(<App />);
