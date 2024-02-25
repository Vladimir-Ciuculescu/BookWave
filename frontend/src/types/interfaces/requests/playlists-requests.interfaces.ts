import { Visibilites } from "types/enums/visibilites.enum";

export interface AddPlayListRequest {
  title: string;
  visibility: Visibilites | "";
  audioId?: string;
}

export interface UpdatePlayListRequest {
  title: string;
  id: string;
  audioId: string;
  visibility: Visibilites;
}

export interface RemoveFromPlaylistRequest {
  playlistId: string;
  audioId: string;
}

export interface GetPlaylistsRequest {
  title: string;
}

export interface getIsExistentInPlaylistRequest {
  audioId: string;
  playlistId: string;
}
