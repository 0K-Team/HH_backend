import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import mongoose from "mongoose";
import "dotenv/config";

import passport from "passport";
import "./auth/google";
import "./auth/facebook";
import "./auth/jwt";
import cookie from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL as string)

const app: Express = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookie());
app.use(passport.initialize());

app.use("/v1/", routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});