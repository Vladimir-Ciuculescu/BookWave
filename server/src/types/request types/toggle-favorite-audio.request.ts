import { RequestHandler, Request } from "express";
import { ObjectId, Schema } from "mongoose";

export interface ToggleFavoriteAudioRequest extends Request {
  query: {
    audioId: any;
  };
}
