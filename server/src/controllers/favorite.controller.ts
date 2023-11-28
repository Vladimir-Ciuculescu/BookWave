import { Response, Request } from "express";
import AudioModel, { AudioDocument } from "models/audio.model";
import FavoriteModel, { FavoriteDocument } from "models/favorite.model";
import { ObjectId, isValidObjectId } from "mongoose";
import { ToggleFavoriteAudioRequest } from "types/requests/audio.requests";
import { GetFavoritesRequest } from "types/requests/favorite.request";

const toggleFavoriteAudio = async (req: ToggleFavoriteAudioRequest, res: Response) => {
  const { audioId } = req.query;
  const userId = req.user.id;

  try {
    let status;
    let isAdded;

    if (!isValidObjectId(audioId)) {
      return res.status(422).json({ error: "Audio Id is invalid !" });
    }

    const audio = await AudioModel.findById(audioId);

    if (!audio) {
      return res.status(404).json({ error: "Audio does not exist !" });
    }

    const alreadyFavorite = await FavoriteModel.findOne({ owner: userId, items: audioId });

    if (alreadyFavorite) {
      // * Audio is already in list and must be unselected
      isAdded = false;
      await alreadyFavorite.updateOne({ $pull: { items: audioId } });
      status = "removed";
    } else {
      const favoriteList = await FavoriteModel.findOne({ owner: userId });

      if (favoriteList) {
        // * Audio is not in the list and you simply add it
        await favoriteList.updateOne({ $addToSet: { items: audioId } });
        isAdded = true;
        status = "added";
      } else {
        // * Add audio file in newly created favorites list !
        isAdded = true;
        status = "Added & Created";
        const newFavoriteList = {
          owner: userId,
          items: [audioId],
        };

        await FavoriteModel.create<FavoriteDocument>(newFavoriteList);
      }
    }

    // * Also update the like status for the current audio
    if (isAdded) {
      await AudioModel.findByIdAndUpdate(audioId, { $addToSet: { likes: userId } });
    } else {
      await AudioModel.findByIdAndUpdate(audioId, { $pull: { likes: userId } });
    }

    return res.status(200).json({ message: status });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const getFavorites = async (req: GetFavoritesRequest, res: Response) => {
  const userId = req.user.id;
  const {
    limit = "20",
    pageNumber = "0",
    //categories
  } = req.query;

  // console.log(11111, categories);

  try {
    const favorites: any = await FavoriteModel.aggregate([
      { $match: { owner: userId } },
      {
        $project: {
          audioIds: { $slice: ["$items", parseInt(limit) * parseInt(pageNumber), parseInt(limit)] },
        },
      },
      { $unwind: "$audioIds" },
      { $lookup: { from: "audios", localField: "audioIds", foreignField: "_id", as: "audio" } },
      { $unwind: "$audio" },

      { $lookup: { from: "users", localField: "audio.owner", foreignField: "_id", as: "owner" } },
      { $unwind: "$owner" },
      {
        $project: {
          _id: 0,
          id: "$audio._id",
          title: "$audio.title",
          about: "$audio.about",
          category: "$audio.category",
          file: "$audio.file.url",
          poster: "$audio.poster.url",
          owner: { name: "$owner.name", id: "$owner._id" },
        },
      },
      //{ $match: { category: { $in: categories } } },
    ]);

    return res.status(200).json({ favorites });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const getIsFavorite = async (req: Request, res: Response) => {
  const { audioId } = req.query;
  const userId = req.user.id;

  try {
    if (!isValidObjectId(audioId)) {
      return res.status(422).json({ error: "Audio id not valid !" });
    }

    const favorite = await FavoriteModel.findOne({ owner: userId, items: audioId });

    // if (!favorite) {
    //   return res.status(422).json({ error: "Audio favorite file does not exist !" });
    // }

    return res.status(200).json({ response: favorite ? true : false });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const FavoriteController = {
  toggleFavoriteAudio,
  getFavorites,
  getIsFavorite,
};

export default FavoriteController;
