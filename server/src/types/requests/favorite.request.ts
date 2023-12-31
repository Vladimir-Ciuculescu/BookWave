import { Request } from "express";
import { Category } from "types/enums/audio-category.enum";

export interface GetFavoritesRequest extends Request {
  query: {
    limit: string;
    pageNumber: string;
    //test
    categories: string;
    title?: string;
  };
}
