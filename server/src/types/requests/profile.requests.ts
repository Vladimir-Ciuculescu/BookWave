import { Request } from "express";

export interface FollowRequest extends Request {
  params: {
    profileId: string;
  };
}

export interface PublicPlaylistsRequest extends Request {
  params: {
    profileId: string;
  };
  query: {
    limit: string;
    pageNumber: string;
  };
}

export interface PublicProfileRequest extends Request {
  params: {
    profileId: string;
  };
}
export interface UnfollowRequest extends Request {
  params: {
    profileId: string;
  };
}
