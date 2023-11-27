export type Track = {
  id: number;
  artist: string;
  title: string;
};

export type MatchingTrack = Track & {
  match_id: number;
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

export type UserRatings = {
  thumb_up_matches_ids: number[];
  thumb_down_matches_ids: number[];
};
