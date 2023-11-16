import { categories } from "consts/categories";
import { visibilites } from "consts/visibilites";
import { Visibilites } from "types/enums/visibilites.enum";
import * as Yup from "yup";

export const uploadAudioSchema = Yup.object().shape({
  title: Yup.string().required("Title is required !"),
  description: Yup.string().required("Description is required !"),
  category: Yup.string()
    .oneOf(categories, "That's not a valid category !")
    .required("The category is required !"),
  audio: Yup.object().shape({
    mimeType: Yup.string().required("Audio file is missing !"),
    name: Yup.string().required("Audio file is missing !"),
    size: Yup.number().required("Audio file is missing !"),
    uri: Yup.string().required("Audio file is missing !"),
  }),
});

export const newPlayListSchema = Yup.object().shape({
  title: Yup.string().required("Title is required !"),
  visibility: Yup.string()
    .oneOf(visibilites, "Invalid visibility option")
    .required("Visibility is required !"),
});
