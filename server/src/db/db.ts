import mongoose from "mongoose";
mongoose
  .connect("mongodb://127.0.0.1:27017/bookwave")
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
  });
