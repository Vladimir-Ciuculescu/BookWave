import { Request } from "express";
import { ObjectId } from "mongoose";
import { Visibility } from "types/enums/visibility.enum";

export interface UpdatePlayListRequest extends Request {
  body: {
    id: ObjectId;
    title: string;
    audioId: ObjectId;
    visibility: Visibility;
  };
}
