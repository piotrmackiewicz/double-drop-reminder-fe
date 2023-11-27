import axios, { AxiosError } from 'axios';
import { useAuthContext } from 'context/authContext';
import { useEffect } from 'react';

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const AxiosInterceptor = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { auth } = useAuthContext();

  useEffect(() => {
    const reqInterceptor = apiClient.interceptors.request.use(
      async (config) => {
        const idToken = await auth.currentUser?.getIdToken();
        config.headers.Authorization = idToken;
        return config;
      }
    );

    const resInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          auth.signOut();
        }
      }
    );

    return () => {
      apiClient.interceptors.request.eject(reqInterceptor);
      apiClient.interceptors.response.eject(resInterceptor);
    };
  }, [auth]);

  return <>{children}</>;
};
