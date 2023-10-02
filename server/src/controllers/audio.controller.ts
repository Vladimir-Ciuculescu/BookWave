import cloudinary from "../cloud/cloud";
import { Request, RequestHandler, Response } from "express";
import AudioModel, { AudioDocument } from "models/audio.model";
import { ObjectId } from "mongoose";
import { AddAudioRequest } from "types/requests/audio.requests";

const addAudioFile: RequestHandler = async (req: AddAudioRequest, res: Response) => {
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

    await AudioModel.create(audio);

    return res.status(201).json({ message: "Audio file uploaded succesfully !" });
  } catch (error) {
    return res.status(422).json({ error });
  }
};

const updateAudioFile = async (req: AddAudioRequest, res: Response) => {
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

const getLatestUploads = async (req: Request, res: Response) => {
  try {
    const uploads = await AudioModel.find()
      .populate<AudioDocument<{ _id: ObjectId; name: string }>>({ path: "owner", select: "name  _id" })
      .sort({ createdAt: "desc" });

    const latest = uploads.map((upload) => {
      return {
        id: upload._id,
        title: upload.title,
        about: upload.about,
        category: upload.category,
        file: upload.file.url,
        poster: upload.poster?.url,
        owner: { id: upload.owner._id, name: upload.owner.name },
      };
    });

    return res.status(200).json({ uploads: latest });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const AudioController = {
  addAudioFile,
  updateAudioFile,
  getLatestUploads,
};

export default AudioController;
