import { Router } from "express";
import PlaylistController from "../controllers/playlist.controller";
import { isAuthenticatedMiddleware } from "../middlewares/is-authenticated.middleware";
import { isVerifiedMiddleware } from "../middlewares/is-verified.middleware";
import { validateMiddleware } from "../middlewares/validate.middleware";
import { addPlayListSchema, updatePlayListSchema } from "../yup/playlists.schemas";

const router: any = Router();

router.post("/add", isAuthenticatedMiddleware, isVerifiedMiddleware, validateMiddleware(addPlayListSchema), PlaylistController.createPlayList);

router.patch("/update", isAuthenticatedMiddleware, isVerifiedMiddleware, validateMiddleware(updatePlayListSchema), PlaylistController.updatePlayList);

router.delete("/delete", isAuthenticatedMiddleware, isVerifiedMiddleware, PlaylistController.removePlayList);

router.get("/is-in-playlist", isAuthenticatedMiddleware, PlaylistController.getIsExistentInPlaylist);

router.get("/by-profile", isAuthenticatedMiddleware, isVerifiedMiddleware, PlaylistController.getPlaylistsByUser);

router.get("/:playlistId", isAuthenticatedMiddleware, isVerifiedMiddleware, PlaylistController.getPlayListAudios);

export default router;
