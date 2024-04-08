export interface GetFavoritesRequest {
  limit?: number;
  pageNumber: string;
  title?: string;
  categories?: string;
}

export interface GetFavoritesTotalCountRequest {
  title?: string;
  categories?: string;
}
