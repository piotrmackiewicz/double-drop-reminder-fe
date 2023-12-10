export type Track = {
  id: number;
  artist: string;
  title: string;
};

export type Match = {
  id: string;
  track_1: string;
  track_2: string;
  thumbs_up: number;
  thumbs_down: number;
};

export type MatchWithRating = Match & { percentage: number };

export type DetailedMatch = {
  id: string;
  track_1: SpotifySearchTrack;
  track_2: SpotifySearchTrack;
  thumbs_up: number;
  thumbs_down: number;
};

export type DetailedMatchWithRating = DetailedMatch & { percentage: number };

export type MatchTracksBody = {
  originTrackId: string;
  matchingTrackId: string;
};

export type SearchQueryParams = {
  [key in string]: string;
};

export type UserRating = {
  id: string;
  match_id: string;
  rating: boolean;
};

export type SpotifySearchTrack = {
  id: string;
  name: string;
  artists: string[];
  preview_url: string | null;
};

export type MatchingTrack = SpotifySearchTrack & {
  match_id: string;
  thumbs_up: number;
  thumbs_down: number;
};
