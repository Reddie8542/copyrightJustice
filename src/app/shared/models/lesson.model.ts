import { AudioConfig } from './audio-config.model';

export interface Lesson {
  videoId: string;
  audioConfigs: AudioConfig[];
}
