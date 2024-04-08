export interface UpdateAudioHistoryRequest {
  audio: string;
  progress: number;
  date: Date;
}

export interface RemoveHistoryRequest {
  histories: string[];
  all: "yes" | "no";
}
