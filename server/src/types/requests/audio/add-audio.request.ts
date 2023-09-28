import { Category } from "types/enums/audio-category.enum";
import { FilesRequest } from "../files.request";

export interface AddAudioRequest extends FilesRequest {
  body: {
    title: string;
    about: string;
    category: Category;
  };
}
