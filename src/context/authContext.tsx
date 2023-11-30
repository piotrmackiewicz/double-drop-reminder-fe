import { Auth, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { createContext, useContext, useState } from 'react';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

type AuthContextType = {
  auth: Auth;
  spotifyAccessToken: string;
  setSpotifyAccessToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth] = useState<Auth>(firebaseAuth);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string>('');
  return (
    <AuthContext.Provider
      value={{
        auth,
        spotifyAccessToken,
        setSpotifyAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const { auth, spotifyAccessToken, setSpotifyAccessToken } = useContext(
    AuthContext
  ) as AuthContextType;

  return {
    auth,
    isAuth: !!auth.currentUser,
    spotifyAccessToken,
    setSpotifyAccessToken,
  };
};
