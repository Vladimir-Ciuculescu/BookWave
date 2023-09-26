import { Request } from "express";

export interface GetPlaylistsRequest extends Request {
  query: {
    limit: string;
    pageNumber: string;
  };
}
