import { Visibilites } from "types/enums/visibilites.enum";

interface PosterAudio {
  _id: string;
  poster: string;
}
export interface PlayList {
  _id: string;
  owner: string;
  title: string;
  visibility: Visibilites;
  audios: string[];
}
