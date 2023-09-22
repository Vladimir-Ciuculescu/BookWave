import FavoriteController from "../controllers/favorite.controller";
import { Router } from "express";
import { isAuthenticatedMiddleware } from "../middlewares/is-authenticated.middleware";
import { isVerifiedMiddleware } from "../middlewares/is-verified.middleware";

const router: any = Router();

router.post("/toggle", isAuthenticatedMiddleware, isVerifiedMiddleware, FavoriteController.toggleFavoriteAudio);

router.get("/", isAuthenticatedMiddleware, isVerifiedMiddleware, FavoriteController.getFavorites);

router.get("/is-favorite", isAuthenticatedMiddleware, FavoriteController.getIsFavorite);

export default router;
