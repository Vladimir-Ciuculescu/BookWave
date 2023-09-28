import { Request } from "express";

export interface getAudiosRequest extends Request {
  query: {
    limit: string;
    pageNumber: string;
  };
}
