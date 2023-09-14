import express from "express";
import "./db/db";
import "module-alias/register";
import "dotenv/config";

import authRouter from "routers/auth";

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`App listening to port ${port}`);
});
