import { Visibilites } from "types/enums/visibilites.enum";
import { AudioFile } from "./audios";

export interface PlayList {
  _id: string;
  owner: string;
  title: string;
  visibility: Visibilites;
  audios: AudioFile[];
  poster?: string;
}

export interface PlayListElement {
  id: string;
  title: string;
  itemsCount: number;
}

export interface PlayListAction {
  label: string;
  icon: JSX.Element;
  onPress: () => void;
}
