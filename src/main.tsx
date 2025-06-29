
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import './styles/premium.css'
import './index.css'
import './styles/premium-override.css'
import './styles/login-animations.css'

createRoot(document.getElementById("root")!).render(<App />);
