
import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from '@/components/ui/toaster'
import LoginV2 from '@/components/auth/LoginV2'
import { PremiumWrapper } from '@/components/PremiumWrapper';
import { ModernVMCalculatorWrapper } from '@/components/modern/ModernVMCalculatorWrapper';

// Import CSS files for premium styling
import './styles/premium.css';
import './styles/premium-override.css';

function App() {
  const [activeTab, setActiveTab] = useState('vm');

  return (
    <div className="premium-app">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginV2 />} />
          <Route path="/" element={
            <PremiumWrapper activeTab={activeTab} onTabChange={setActiveTab}>
              {activeTab === 'vm' && <ModernVMCalculatorWrapper />}
              {activeTab === 'pool' && <div className="premium-card p-8 m-4"><h2 className="text-gold text-2xl">Pool de Recursos Content</h2></div>}
              {activeTab === 'upgrades' && <div className="premium-card p-8 m-4"><h2 className="text-gold text-2xl">Upgrades Content</h2></div>}
              {activeTab === 'propostas' && <div className="premium-card p-8 m-4"><h2 className="text-gold text-2xl">Propostas Content</h2></div>}
            </PremiumWrapper>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  )
}

export default App
