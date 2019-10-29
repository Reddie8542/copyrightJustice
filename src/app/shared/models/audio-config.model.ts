export interface AudioConfig {
  trackData: TrackData;
  videoStart: LessonTimestamp;
}

export interface TrackData {
  trackId: string;
  trackStart: LessonTimestamp;
  trackEnd: LessonTimestamp;
}

export interface LessonTimestamp {
  hours: number;
  minutes: number;
  seconds: number;
}
