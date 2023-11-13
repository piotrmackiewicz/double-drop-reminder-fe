import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  idToken?: string;
  setIdToken: (idToken: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [idToken, setIdToken] = useState<string>();

  return (
    <AuthContext.Provider value={{ idToken, setIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const { idToken, setIdToken } = useContext(AuthContext) as AuthContextType;

  return {
    idToken,
    setIdToken,
  };
};
