import axios from 'axios';
import { MatchTracksBody, SearchQueryParams, Track } from 'types';
import { apiClient } from './client';

const API_URL = process.env.REACT_APP_API_URL;

export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const result = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
  });
  return result;
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const result = await axios.post<{ idToken: string }>(
    `${API_URL}/auth/login`,
    {
      email,
      password,
    }
  );
  return result;
};

export const search = async (
  query: string,
  queryParams?: SearchQueryParams
) => {
  const result = await apiClient.post<Track[]>(
    `${API_URL}/search`,
    {
      search: query,
    },
    { params: queryParams }
  );

  return result;
};

export const getTrack = async (id: string): Promise<Track> => {
  const result = await apiClient.get<Track>(`${API_URL}/track/${id}`);
  return result.data;
};

export const addTrack = async (body: {
  title: string;
  artist: string;
}): Promise<Track> => {
  const result = await apiClient.post<Track>(`${API_URL}/track`, body);
  return result.data;
};

export const getMatchingTracks = async (id: number): Promise<Track[]> => {
  const result = await apiClient.get<Track[]>(
    `${API_URL}/matching-tracks/${id}`
  );
  return result.data;
};

export const matchTracks = async (body: MatchTracksBody) => {
  await apiClient.post(`${API_URL}/matching-tracks`, body);
};
