
import React, { useState } from 'react';
import { ModernCalculatorLayout } from '@/components/ModernCalculatorLayout';
import { PremiumWrapper } from "@/components/PremiumWrapper";

const Index = () => {
  const [activeTab, setActiveTab] = useState('vm');

  return (
    <div className="w-full">
      <PremiumWrapper activeTab={activeTab} onTabChange={setActiveTab}>
        <ModernCalculatorLayout />
      </PremiumWrapper>
    </div>
  );
};

export default Index;
