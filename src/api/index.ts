import axios from 'axios';
import { MatchTracksBody, SearchQueryParams, Track } from 'types';

const API_URL = process.env.REACT_APP_API_URL;

export const search = async (
  query: string,
  queryParams?: SearchQueryParams
) => {
  const result = await axios.post<Track[]>(
    `${API_URL}/search`,
    {
      search: query,
    },
    { params: queryParams }
  );

  return result;
};

export const getTrack = async (id: string): Promise<Track> => {
  const result = await axios.get<Track>(`${API_URL}/track/${id}`);
  return result.data;
};

export const addTrack = async (body: {
  title: string;
  artist: string;
}): Promise<Track> => {
  const result = await axios.post<Track>(`${API_URL}/track`, body);
  return result.data;
};

export const getMatchingTracks = async (id: number): Promise<Track[]> => {
  const result = await axios.get<Track[]>(`${API_URL}/matching-tracks/${id}`);
  return result.data;
};

export const deleteMatchingTrack = async (data: MatchTracksBody) => {
  await axios.delete(`${API_URL}/matching-tracks`, { data });
};

export const matchTracks = async (body: MatchTracksBody) => {
  await axios.post(`${API_URL}/matching-tracks`, body);
};
