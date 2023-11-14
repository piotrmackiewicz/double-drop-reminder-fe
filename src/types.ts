export type Track = {
  id: number;
  artist: string;
  title: string;
};

export type MatchTracksBody = {
  originTrackId: number;
  matchingTrackId: number;
};

export type SearchQueryParams = {
  [key in string]: string;
};
