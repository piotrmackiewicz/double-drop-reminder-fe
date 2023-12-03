import { createBrowserRouter } from 'react-router-dom';
import { Search } from 'pages/Search';
import { TrackDetails } from 'pages/TrackDetails';
import { AddMatchingTrack } from 'pages/AddMatchingTrack';
import { Default } from 'pages/Default';
import { Layout } from 'components/Layout';
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { ProtectedRoute } from 'components/ProtectedRoute';
// import { MyAccount } from 'pages/MyAccount';

export enum ROUTES {
  Search = '/search',
  TrackDetails = '/track/:id',
  AddMatchingTrack = '/track/:id/add-matching-track',
  // MyAccount = '/my-account',
  Register = '/register',
  Login = '/login',
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: ROUTES.Login,
        element: <Login />,
      },
      {
        path: ROUTES.Register,
        element: <Register />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.Search,
            element: <Search />,
          },
          {
            path: ROUTES.TrackDetails,
            element: <TrackDetails />,
          },
          {
            path: ROUTES.AddMatchingTrack,
            element: <AddMatchingTrack />,
          },
          // {
          //   path: ROUTES.MyAccount,
          //   element: <MyAccount />,
          // },
        ],
      },
      {
        path: '*',
        element: <Default />,
      },
    ],
  },
]);
