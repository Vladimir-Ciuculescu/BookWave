import ProfileController from "../controllers/profile.controller";
import { Router } from "express";
import { isAuthenticatedMiddleware } from "../middlewares/is-authenticated.middleware";
import { isVerifiedMiddleware } from "../middlewares/is-verified.middleware";
import { shouldBeAuthenticatedMiddleware } from "../middlewares/shouldBeAuthenticatedMiddleware";

const router: any = Router();

router.post("/follow/:profileId", isAuthenticatedMiddleware, isVerifiedMiddleware, ProfileController.followProfile);

router.post("/unfollow/:profileId", isAuthenticatedMiddleware, isVerifiedMiddleware, ProfileController.unfollowProfile);

router.get("/audios", isAuthenticatedMiddleware, isVerifiedMiddleware, ProfileController.getAudios);

router.get("/recommended", shouldBeAuthenticatedMiddleware, ProfileController.getRecommendedAudios);

router.get("/:profileId", ProfileController.getPublicProfile);

router.get("/playlists/:profileId", ProfileController.getPublicPlaylists);

export default router;
