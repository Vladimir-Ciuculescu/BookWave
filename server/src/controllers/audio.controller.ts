import cloudinary from "../cloud/cloud";
import { RequestHandler, Response } from "express";
import AudioModel, { AudioDocument } from "models/audio.model";
import { AudioRequest } from "types/request types/audio.request";

const addAudioFile: RequestHandler = async (req: AudioRequest, res: Response) => {
  const { title, about, category } = req.body;

  const audioFile = req.files?.audio;
  const posterFile = req.files?.poster;
  const ownerId = req.user.id;
  let poster;
  try {
    if (!audioFile) {
      return res.status(422).json({ error: "Audio file is missing !" });
    }

    const { public_id, secure_url } = await cloudinary.uploader.upload(audioFile[0].filepath, { resource_type: "video" });

    if (posterFile) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(posterFile[0].filepath, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      });

      poster = { url: secure_url, publicId: public_id };
    }

    const audio = {
      title,
      about,
      owner: ownerId,
      category,
      file: { url: secure_url, publicId: public_id },
      likes: [],
      poster,
    };

    await AudioModel.create<AudioDocument>(audio);

    return res.status(201).json({ message: "Audio file uploaded succesfully !" });
  } catch (error) {
    return res.status(422).json({ error });
  }
};

const updateAudioFile = async (req: AudioRequest, res: Response) => {
  const { title, about, category } = req.body;
  const user = req.user;
  const posterFile = req.files?.poster;
  const { audioId } = req.params;

  try {
    const audio = await AudioModel.findOneAndUpdate({ _id: audioId, owner: user.id }, { title, about, category }, { new: true });

    if (!audio) {
      return res.status(404).json({ error: "Audio file not found !" });
    }

    if (posterFile) {
      if (audio.poster?.publicId) {
        await cloudinary.uploader.destroy(audio.poster.publicId);
      }

      const { public_id, secure_url } = await cloudinary.uploader.upload(posterFile[0].filepath, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      });

      audio.poster = { url: secure_url, publicId: public_id };

      await audio.save();
    }

    return res.status(200).json({ audio: audio });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const AudioController = {
  addAudioFile,
  updateAudioFile,
};

export default AudioController;
