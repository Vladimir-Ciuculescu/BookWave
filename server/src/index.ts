import express from "express";
import mongoose from "mongoose";

import "module-alias/register";
import "dotenv/config";

// ? Routers
import usersRouter from "routers/user.route";
import audioRouter from "routers/audio.route";
import favoriteRouter from "routers/favorite.route";
import playlistRouter from "routers/playlist.route";
import profileRouter from "routers/profile.route";

const app = express();

const connectToDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to Database !");
  } catch (error) {
    console.log("Cannot connect to Database :", error);
  }
};

connectToDB();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

// ? ROUTES
app.use("/users", usersRouter);
app.use("/audio", audioRouter);
app.use("/favorites", favoriteRouter);
app.use("/playlist", playlistRouter);
app.use("/profile", profileRouter);

app.listen(PORT, () => {
  console.log(`application running on port ${PORT} !`);
});
