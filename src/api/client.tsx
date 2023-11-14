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
  const { idToken, setIdToken } = useAuthContext();

  useEffect(() => {
    const reqInterceptor = apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = idToken;
      return config;
    });

    const resInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.log(error);
        if (error.response?.status === 401) {
          localStorage.removeItem('idToken');
          setIdToken('');
        }
      }
    );

    return () => {
      apiClient.interceptors.request.eject(reqInterceptor);
      apiClient.interceptors.response.eject(resInterceptor);
    };
  }, [idToken, setIdToken]);

  return <>{children}</>;
};
