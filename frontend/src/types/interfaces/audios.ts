import { Categories } from "types/enums/categories.enum";

export interface AudioFile {
  id: string;
  title: string;
  about: string;
  category: Categories;
  file: string;
  poster?: string;
  owner: { id: string; name: string };
}
