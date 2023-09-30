import PlaylistController from "../controllers/playlist.controller";
import { Router } from "express";
import { isAuthenticatedMiddleware } from "../middlewares/is-authenticated.middleware";
import { isVerifiedMiddleware } from "../middlewares/is-verified.middleware";
import { validateMiddleware } from "../middlewares/validate.middleware";
import { addPlayListSchema, updatePlayListSchema } from "../yup/playlists.schemas";

const router: any = Router();

router.post(
  "/add",
  isAuthenticatedMiddleware,
  isVerifiedMiddleware,
  validateMiddleware(addPlayListSchema),
  PlaylistController.createPlayList,
);

router.patch(
  "/update",
  isAuthenticatedMiddleware,
  isVerifiedMiddleware,
  validateMiddleware(updatePlayListSchema),
  PlaylistController.updatePlayList,
);

router.delete("/delete", isAuthenticatedMiddleware, isVerifiedMiddleware, PlaylistController.removePlayList);

router.get("/", isAuthenticatedMiddleware, isVerifiedMiddleware, PlaylistController.getPlaylistsByUser);

router.get("/:playlistId", isAuthenticatedMiddleware, isVerifiedMiddleware, PlaylistController.getPlayListAudios);

export default router;
