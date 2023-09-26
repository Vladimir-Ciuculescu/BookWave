import { Request } from "express";

export interface RemovePlayListRequest extends Request {
  query: {
    audioId?: string;
    playlistId: string;
    all: "yes" | "no";
  };
}
