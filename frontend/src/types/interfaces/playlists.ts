import { Visibilites } from "types/enums/visibilites.enum";

export interface PlayList {
  _id: string;
  owner: string;
  title: string;
  visibility: Visibilites;
  items: string[];
}
