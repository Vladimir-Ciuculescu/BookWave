import { Category } from "types/enums/categories.enum";

export interface GetFavoritesRequest {
  limit: number;
  pageNumber: number;
  title: string;
  categories?: string;
}
