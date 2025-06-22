
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

function App() {
  const [activeTab, setActiveTab] = useState('vm');

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginV2 />} />
          <Route path="/" element={
            <PremiumWrapper activeTab={activeTab} onTabChange={setActiveTab}>
              {activeTab === 'vm' && <ModernVMCalculatorWrapper />}
              {activeTab === 'pool' && <div>Pool de Recursos Content</div>}
              {activeTab === 'upgrades' && <div>Upgrades Content</div>}
              {activeTab === 'propostas' && <div>Propostas Content</div>}
            </PremiumWrapper>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
