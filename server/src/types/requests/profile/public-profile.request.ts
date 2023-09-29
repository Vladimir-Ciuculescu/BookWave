import { Request } from "express";

export interface PublicProfileRequest extends Request {
  params: {
    profileId: string;
  };
}
