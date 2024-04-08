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

export interface DeletePlaylistRequest {
  playlistId: string;
}

export interface GetPlaylistsRequest {
  title: string;
  limit?: string;
  pageNumber?: string;
}

export interface GetPlaylistaudiosRequest {
  playlistId: string;
}

export interface GetPlaylistsTotalCountRequest {
  title: string;
}

export interface GetPlaylistAudiosTotalCountRequest {
  playlistId: string;
}

export interface GetPlaylistAudiosTotalDurationRequest {
  playlistId: string;
}

export interface getIsExistentInPlaylistRequest {
  audioId: string;
  playlistId: string;
}
