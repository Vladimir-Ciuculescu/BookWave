import { Request } from "express";

export interface PublicPlaylistsRequest extends Request {
  params: {
    profileId: string;
  };
  query: {
    limit: string;
    pageNumber: string;
  };
}
