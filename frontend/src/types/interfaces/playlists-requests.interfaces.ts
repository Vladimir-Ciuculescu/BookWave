import { Visibilites } from "types/enums/visibilites.enum";

export interface AddPlayListRequest {
  title: string;
  visibility: Visibilites | "";
  audioId: string;
}

export interface UpdatePlayListRequest {
  title: string;
  id: string;
  audioId: string;
  visibility: Visibilites;
}
