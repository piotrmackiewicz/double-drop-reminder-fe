import axios from 'axios';
import {
  Match,
  MatchTracksBody,
  SearchQueryParams,
  SpotifySearchTrack,
  Track,
  UserRating,
} from 'types';
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
  const result = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
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

export const addTrack = async (body: {
  title: string;
  artist: string;
}): Promise<Track> => {
  const result = await apiClient.post<Track>(`${API_URL}/track`, body);
  return result.data;
};

export const getMatches = async (id: string): Promise<Match[]> => {
  const result = await apiClient.get<Match[]>(`${API_URL}/matches/${id}`);
  return result.data;
};

export const matchTracks = async (body: MatchTracksBody) => {
  await apiClient.post(`${API_URL}/matches`, body);
};

export const getUserRating = async () => {
  const result = await apiClient.get<UserRating[]>('/user-rating');
  return result.data;
};

export const rateMatch = async (matchId: string, rate: boolean) => {
  await apiClient.post(`${API_URL}/user-rating`, { matchId, rate });
};

export const getSpotifyToken = async () => {
  const result = await apiClient.get<{ accessToken: string }>(
    `${API_URL}/search/get-spotify-token`
  );
  return result.data;
};

export const searchSpotify = async (
  query: string,
  token: string
): Promise<SpotifySearchTrack[]> => {
  const result = await axios.get<{
    tracks: {
      items: {
        id: string;
        name: string;
        preview_url: string;
        artists: {
          name: string;
        }[];
      }[];
    };
  }>(`https://api.spotify.com/v1/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { q: query, type: 'track' },
  });

  return result.data.tracks.items.map(({ id, name, preview_url, artists }) => ({
    id,
    name,
    preview_url,
    artists: artists.map((artist) => artist.name),
  }));
};

export const getTrack = async (
  trackId: string,
  token: string
): Promise<SpotifySearchTrack> => {
  const result = await axios.get<{
    id: string;
    name: string;
    preview_url: string;
    artists: {
      name: string;
    }[];
  }>(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { id, name, preview_url, artists } = result.data;
  return {
    id,
    name,
    preview_url,
    artists: artists.map((artist) => artist.name),
  };
};

export const getTracks = async (
  tracksIds: string[],
  token: string
): Promise<SpotifySearchTrack[]> => {
  const result = await axios.get<{
    tracks: {
      id: string;
      name: string;
      preview_url: string;
      artists: {
        name: string;
      }[];
    }[];
  }>(`https://api.spotify.com/v1/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { ids: tracksIds.join(',') },
  });

  return result.data.tracks.map(({ id, name, preview_url, artists }) => ({
    id,
    name,
    preview_url,
    artists: artists.map((artist) => artist.name),
  }));
};

export const getMatchesByIds = async (ids: string[]): Promise<Match[]> => {
  const result = await apiClient.get(`${API_URL}/matches`, {
    params: {
      ids: ids,
    },
  });
  return result.data;
};
