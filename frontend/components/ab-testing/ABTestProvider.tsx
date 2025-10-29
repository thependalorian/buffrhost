import React, { createContext, useContext, useState, useEffect } from 'react';

interface ABTestContextType {
  variant: 'A' | 'B' | 'C';
  setVariant: (variant: 'A' | 'B' | 'C') => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

export const ABTestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [variant, setVariant] = useState<'A' | 'B' | 'C'>('A');

  useEffect(() => {
    // Load variant from localStorage or determine randomly
    const savedVariant = localStorage.getItem('ab-test-variant') as
      | 'A'
      | 'B'
      | 'C';
    if (savedVariant) {
      setVariant(savedVariant);
    } else {
      const randomVariant = ['A', 'B', 'C'][Math.floor(Math.random() * 3)] as
        | 'A'
        | 'B'
        | 'C';
      setVariant(randomVariant);
      localStorage.setItem('ab-test-variant', randomVariant);
    }
  }, []);

  return (
    <ABTestContext.Provider value={{ variant, setVariant }}>
      {children}
    </ABTestContext.Provider>
  );
};

export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
};
