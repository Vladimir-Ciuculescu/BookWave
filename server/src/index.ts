import express from "express";
import "module-alias/register";
import "dotenv/config";
import authRouter from "routers/user.route";
import mongoose from "mongoose";

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

app.use("/users", authRouter);

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT} !`);
});
