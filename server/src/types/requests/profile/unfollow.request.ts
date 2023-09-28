import { Request } from "express";

export interface UnfollowRequest extends Request {
  params: {
    profileId: string;
  };
}
