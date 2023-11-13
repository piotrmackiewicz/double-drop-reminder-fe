import { createBrowserRouter } from 'react-router-dom';
import { Search } from 'pages/Search';
import { TrackDetails } from 'pages/TrackDetails';
import { AddTrack } from 'pages/AddTrack';
import { AddMatchingTrack } from 'pages/AddMatchingTrack';
import { Default } from 'pages/Default';
import { Layout } from 'components/Layout';

export enum ROUTES {
  Search = '/search',
  TrackDetails = '/track/:id',
  AddMatchingTrack = '/track/:id/add-matching-track',
  AddTrack = '/add-track',
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
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
        path: ROUTES.AddTrack,
        element: <AddTrack />,
      },
      {
        path: ROUTES.AddMatchingTrack,
        element: <AddMatchingTrack />,
      },
      {
        path: '*',
        element: <Default />,
      },
    ],
  },
]);
