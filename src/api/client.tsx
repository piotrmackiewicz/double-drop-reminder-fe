import axios from 'axios';
import { useAuthContext } from 'context/authContext';
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ROUTES } from 'router';

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const AxiosInterceptor = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { idToken } = useAuthContext();
  // const navigate = useNavigate();

  useEffect(() => {
    const reqInterceptor = apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = idToken;
      return config;
    });

    // TODO: when api respond with 401, it should navigate to login page and clear the auth context
    // const resInterceptor = apiClient.interceptors.response.use((response) => {
    //   if (response.status === 401) {
    //     navigate(ROUTES.Login);
    //   }
    //   return response;
    // });

    return () => {
      apiClient.interceptors.request.eject(reqInterceptor);
      // apiClient.interceptors.response.eject(resInterceptor);
    };
  }, [idToken]);

  return <>{children}</>;
};
