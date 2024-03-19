import { Category } from "types/enums/categories.enum";

export interface AudioFile {
  id: string;
  title: string;
  about: string;
  category: Category;
  file: string;
  poster?: string;
  owner: { id: string; name: string };
  duration: number;
}

export interface AudioAction {
  label: string;
  icon: JSX.Element;
  onPress: () => void;
}
