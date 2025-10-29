import React, { createContext, useContext, useState, useEffect } from 'react';

interface ColorBlindContextType {
  isColorBlindMode: boolean;
  toggleColorBlindMode: () => void;
}

const ColorBlindContext = createContext<ColorBlindContextType | undefined>(
  undefined
);

export const ColorBlindProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('color-blind-mode') === 'true';
    setIsColorBlindMode(savedMode);
  }, []);

  const toggleColorBlindMode = () => {
    const newMode = !isColorBlindMode;
    setIsColorBlindMode(newMode);
    localStorage.setItem('color-blind-mode', newMode.toString());
  };

  return (
    <ColorBlindContext.Provider
      value={{ isColorBlindMode, toggleColorBlindMode }}
    >
      <div className={isColorBlindMode ? 'color-blind-mode' : ''}>
        {children}
      </div>
    </ColorBlindContext.Provider>
  );
};

export const useColorBlind = () => {
  const context = useContext(ColorBlindContext);
  if (context === undefined) {
    throw new Error('useColorBlind must be used within a ColorBlindProvider');
  }
  return context;
};

// Color Blind Toggle Component
export const ColorBlindToggle: React.FC = () => {
  const { isColorBlindMode, toggleColorBlindMode } = useColorBlind();

  return (
    <button
      onClick={toggleColorBlindMode}
      className={`
        fixed bottom-4 left-4 z-50
        px-3 py-2 rounded-lg text-sm font-medium
        transition-all duration-300
        ${
          isColorBlindMode
            ? 'bg-cta-primary text-white shadow-lg'
            : 'bg-nude-100 text-nude-700 hover:bg-nude-200'
        }
        focus:outline-none focus:ring-2 focus:ring-cta-primary focus:ring-offset-2
      `}
      aria-label={
        isColorBlindMode
          ? 'Disable color blind mode'
          : 'Enable color blind mode'
      }
    >
      {isColorBlindMode ? '🎨' : '👁️'} Color Blind
    </button>
  );
};
