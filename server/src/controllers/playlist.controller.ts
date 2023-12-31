import { Response } from "express";
import AudioModel from "models/audio.model";
import PlayListModel, { PlayListDocument } from "models/playlist.model";
import { PipelineStage, Schema, isValidObjectId } from "mongoose";
import {
  AddPlayListRequest,
  GetPlaylistAudiosRequest,
  GetPlaylistsRequest,
  RemovePlayListRequest,
  UpdatePlayListRequest,
} from "types/requests/playlist.requests";

const createPlayList = async (req: AddPlayListRequest, res: Response) => {
  const { title, audioId, visibility } = req.body;

  console.log(111, req.body);
  const ownerId = req.user.id as Schema.Types.ObjectId;

  try {
    if (audioId) {
      const audio = await AudioModel.findById(audioId);

      if (!audio) {
        return res.status(404).json({ error: "Audio not found !" });
      }
    }

    const playlist: PlayListDocument = {
      title,
      owner: ownerId,
      visibility,
      items: [],
    };

    if (audioId) {
      playlist.items.push(audioId);
    }

    const createdPlaylist = await PlayListModel.create<PlayListDocument>(playlist);

    return res.status(200).json({ playlist: createdPlaylist });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const updatePlayList = async (req: UpdatePlayListRequest, res: Response) => {
  const { title, id, audioId, visibility } = req.body;
  const userId = req.user.id;

  try {
    const playlist = await PlayListModel.findOneAndUpdate({ _id: id, owner: userId }, { title, visibility }, { new: true });

    if (!playlist) {
      return res.status(422).json({ error: "Audio file not found !" });
    }

    if (audioId) {
      await PlayListModel.findByIdAndUpdate(playlist._id, { visibility, title, $addToSet: { items: audioId } });
    }

    return res.status(200).json({
      playlist: {
        id: playlist.id,
        title,
        visibility,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const removePlayList = async (req: RemovePlayListRequest, res: Response) => {
  const { playlistId, audioId, all } = req.query;
  const userId = req.user.id;

  try {
    if (!isValidObjectId(playlistId)) {
      return res.status(422).json({ error: "Playlist Id not valid !" });
    }

    if (all === "yes") {
      const playlistToDelete = await PlayListModel.findByIdAndDelete(playlistId);

      if (!playlistToDelete) {
        return res.status(404).json({ error: "Playlist not found !" });
      }

      return res.status(200).json({ message: "Playlist deleted succesfully !" });
    } else {
      const playlist = await PlayListModel.findOneAndUpdate({ _id: playlistId, owner: userId }, { $pull: { items: audioId } });

      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found !" });
      }

      return res.status(200).json({ message: "Audio succesfully removed !" });
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const getPlaylistsByUser = async (req: GetPlaylistsRequest, res: Response) => {
  const userId = req.user.id;
  const { limit = "20", pageNumber = "0", title } = req.query;

  // * Fetch only the summary of each playlist, not all audios from each one
  try {
    const pipeline: PipelineStage[] = [
      { $match: { owner: userId, visibility: { $ne: "auto" } } },
      {
        $project: {
          audio: { $slice: ["$items", parseInt(limit) * parseInt(pageNumber), parseInt(limit)] },
          title: "$title",
          visibility: "$visibility",
          updatedAt: "$updatedAt",
        },
      },
      { $unwind: { path: "$audio", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "audios", localField: "audio", foreignField: "_id", as: "audio" } },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          visibility: { $first: "$visibility" },
          updatedAt: { $first: "$updatedAt" },
          audios: { $push: { $ifNull: [{ $arrayElemAt: ["$audio", 0] }, null] } },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          visibility: 1,
          audios: {
            $cond: {
              if: { $eq: [{ $arrayElemAt: ["$audios", 0] }, null] },
              then: [],
              else: {
                $map: {
                  input: "$audios",
                  as: "audio",
                  in: {
                    $cond: {
                      if: { $eq: [{ $indexOfArray: ["$audios", "$$audio"] }, 0] },
                      then: { _id: "$$audio._id", poster: "$$audio.poster.url" },
                      else: { _id: "$$audio._id" },
                    },
                  },
                },
              },
            },
          },
          updatedAt: 1,
        },
      },
      { $sort: { updatedAt: -1 } },
    ];

    if (title) {
      pipeline.push({ $match: { title: { $regex: title, $options: "i" } } });
    }

    const playlists = await PlayListModel.aggregate(pipeline);

    return res.status(200).json({ playlists });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const getPlayListAudios = async (req: GetPlaylistAudiosRequest, res: Response) => {
  const { playlistId } = req.params;
  const userId = req.user.id;

  try {
    if (!isValidObjectId(playlistId)) {
      return res.status(422).json({ error: "Invalid playlist id !" });
    }

    const playlist = await PlayListModel.findOne({ _id: playlistId, owner: userId }).populate({
      path: "items",
      populate: { path: "owner", select: "name " },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found !" });
    }

    const audios: any = playlist.items.map((audio: any) => {
      return {
        id: audio._id,
        title: audio.title,
        category: audio.category,
        file: audio.file.url,
        poster: audio.poster.url,
        owner: {
          id: audio.owner.id,
          name: audio.owner.name,
        },
      };
    });

    return res.status(200).json({ audios });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
};

const PlaylistController = {
  createPlayList,
  updatePlayList,
  removePlayList,
  getPlaylistsByUser,
  getPlayListAudios,
};

export default PlaylistController;
