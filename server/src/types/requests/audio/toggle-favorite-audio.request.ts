import { Request } from "express";

export interface ToggleFavoriteAudioRequest extends Request {
  query: {
    audioId: any;
  };
}
