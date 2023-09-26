import { Request } from "express";
import { ObjectId } from "mongoose";
import { Visibility } from "types/enums/visibility.enum";

export interface AddPlayListRequest extends Request {
  body: {
    title: string;
    audioId: ObjectId;
    visibility: Visibility;
  };
}
