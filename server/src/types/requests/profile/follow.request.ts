import { Request } from "express";

export interface FollowRequest extends Request {
  params: {
    profileId: string;
  };
}
