import { Request } from "express";

export interface GetFavoritesRequest extends Request {
  query: {
    limit: string;
    pageNumber: string;
  };
}
