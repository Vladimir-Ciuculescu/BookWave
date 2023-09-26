import { Request } from "express";

export interface GetPlaylistAudiosRequest extends Request {
  params: {
    playlistId: string;
  };
}
