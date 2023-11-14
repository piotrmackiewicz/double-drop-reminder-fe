import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  idToken?: string;
  setIdToken: (idToken: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const lsIdToken = localStorage.getItem('idToken') || '';
  const [idToken, setIdToken] = useState<string>(lsIdToken);

  return (
    <AuthContext.Provider value={{ idToken, setIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const { idToken, setIdToken: setIdTokenInContext } = useContext(
    AuthContext
  ) as AuthContextType;

  return {
    idToken,
    setIdToken: (idToken: string) => {
      setIdTokenInContext(idToken);
      localStorage.setItem('idToken', idToken);
    },
  };
};
