import { Artist } from './artist.model';

export interface Track {
  album: any;
  artists: Array<Artist>;
  duration: number;
  id: string;
  name: string;
}
