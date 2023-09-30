import { Response, Request } from "express";
import AudioModel, { AudioDocument } from "models/audio.model";
import FavoriteModel, { FavoriteDocument } from "models/favorite.model";
import { ObjectId, isValidObjectId } from "mongoose";
import { ToggleFavoriteAudioRequest } from "types/requests/audio.requests";

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
      status = "Audio succesfully removed from list !";
    } else {
      const favoriteList = await FavoriteModel.findOne({ owner: userId });

      if (favoriteList) {
        // * Audio is not in the list and you simply add it
        await favoriteList.updateOne({ $addToSet: { items: audioId } });
        isAdded = true;
        status = "Audio succesfully added to the list !";
      } else {
        // * Add audio file in newly created favorites list !
        isAdded = true;
        status = "Audio file added, new list created !";
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

const getFavorites = async (req: Request, res: Response) => {
  const userId = req.user.id;

  try {
    const favorites: any = await FavoriteModel.findOne({ owner: userId }).populate({
      path: "items",
      populate: { path: "owner" },
    });

    if (!favorites) {
      return res.status(200).json({ audios: [] });
    }

    const audios = favorites.items.map((item: AudioDocument<{ _id: ObjectId; name: string }>) => {
      return {
        id: item._id,
        title: item.title,
        category: item.category,
        file: item.file.url,
        poster: item.poster?.url,
        owner: {
          name: item.owner.name,
          id: item.owner._id,
        },
      };
    });

    return res.status(200).json({ audios });
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
