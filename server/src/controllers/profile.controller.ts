import { Response } from "express";
import AudioModel from "models/audio.model";
import PlayListModel from "models/playlist.model";
import UserModel from "models/user.model";
import { isValidObjectId } from "mongoose";
import { getAudiosRequest } from "types/requests/audio.requests";
import { FollowRequest, PublicPlaylistsRequest, PublicProfileRequest, UnfollowRequest } from "types/requests/profile.requests";

const followProfile = async (req: FollowRequest, res: Response) => {
  const { profileId } = req.params;
  const userId = req.user.id;

  try {
    if (!isValidObjectId(profileId)) {
      return res.status(422).json({ error: "Invalid profile Id" });
    }

    // ? Update the list of followings for current logged in user
    await UserModel.findByIdAndUpdate(userId, { $addToSet: { followings: profileId } });

    // ? Update the list of followers for the followed user
    await UserModel.findByIdAndUpdate(profileId, { $addToSet: { followers: userId } });

    return res.status(200).json({ message: "Profile added to follow !" });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const unfollowProfile = async (req: UnfollowRequest, res: Response) => {
  const { profileId } = req.params;
  const userId = req.user.id;

  try {
    if (!isValidObjectId(profileId)) {
      return res.status(422).json({ error: "Invalid object id !" });
    }

    // ? Remove the profile from followings list of the current logged in user
    await UserModel.findByIdAndUpdate(userId, { $pull: { followings: profileId } });

    // ? Remove the current logged in user from followers list of the profile user
    await UserModel.findByIdAndUpdate(profileId, { $pull: { followers: userId } });

    return res.status(200).json({ message: "Profile removed from follow !" });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const getAudios = async (req: getAudiosRequest, res: Response) => {
  const userId = req.user.id;
  const { limit = "20", pageNumber = "0" } = req.query;

  try {
    const response = await AudioModel.find({ owner: userId })
      .sort({ createdAt: "desc" })
      .skip(parseInt(pageNumber) * parseInt(limit))
      .limit(parseInt(limit));

    const audios = response.map((audio) => {
      return {
        id: audio._id,
        title: audio.title,
        about: audio.about,
        file: audio.file.url,
        poster: audio.poster?.url,
        date: audio.createdAt,
        owner: { id: userId, name: req.user.name },
      };
    });

    return res.status(200).json({ audios });
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
};

const getPublicProfile = async (req: PublicProfileRequest, res: Response) => {
  const { profileId } = req.params;

  try {
    if (!isValidObjectId(profileId)) {
      return res.status(422).json({ error: "Invalid Profile id !" });
    }

    const profile = await UserModel.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found !" });
    }

    return res.status(200).json({
      id: profile._id,
      name: profile.name,
      followers: profile.followers.length,
      avatar: profile.avatar?.url,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const getPublicPlaylists = async (req: PublicPlaylistsRequest, res: Response) => {
  const { profileId } = req.params;
  const { limit, pageNumber } = req.query;

  try {
    if (!isValidObjectId(profileId)) {
      return res.status(422).json({ error: "Invalid profile id !" });
    }

    const playlists = await PlayListModel.find({
      owner: profileId,
      visibility: "public",
    })
      .sort({ createdAt: "desc" })
      .skip(parseInt(limit) * parseInt(pageNumber))
      .limit(parseInt(limit));

    return res.status(200).json({
      playlists: playlists.map((playlist) => {
        return {
          id: playlist._id,
          title: playlist.title,
          items: playlist.items.length,
        };
      }),
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error });
  }
};

const ProfileController = {
  followProfile,
  unfollowProfile,
  getAudios,
  getPublicProfile,
  getPublicPlaylists,
};

export default ProfileController;
