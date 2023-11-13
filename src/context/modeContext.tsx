import { createContext, useContext, useState } from 'react';

type Mode = 'preparation' | 'performance';

type ModeContextType = {
  mode: 'preparation' | 'performance';
  setMode: (mode: 'preparation' | 'performance') => void;
};

const ModeContext = createContext<ModeContextType | null>(null);

export const ModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>('preparation');

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useModeContext = () => {
  const { mode, setMode } = useContext(ModeContext) as ModeContextType;

  const switchMode = () => {
    setMode(mode === 'preparation' ? 'performance' : 'preparation');
  };

  return {
    mode,
    switchMode,
    isPreparationMode: mode === 'preparation',
  };
};
