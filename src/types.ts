export type Track = {
  id: number;
  artist: string;
  title: string;
  matching_tracks: number[];
  thumbs_up: number;
  thumbs_down: number;
};

export type MatchTracksBody = {
  originTrackId: number;
  matchingTrackId: number;
};

export type SearchQueryParams = {
  [key in string]: string;
};
