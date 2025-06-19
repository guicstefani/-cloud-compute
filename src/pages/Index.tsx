
import React from 'react';
import { motion } from 'framer-motion';
import DarkCalculatorLayout from '@/components/DarkCalculatorLayout';

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DarkCalculatorLayout />
    </motion.div>
  );
};

export default Index;
