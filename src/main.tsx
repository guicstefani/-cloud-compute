
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import './styles/premium.css'
import './index.css'
import './styles/premium-override.css'
import './styles/login-animations.css'

// Importar e inicializar o sistema de força UX
import { forceUXApplication } from './utils/forceUXApplication'

// Inicializar aplicação forçada das melhorias UX
forceUXApplication();

createRoot(document.getElementById("root")!).render(<App />);
