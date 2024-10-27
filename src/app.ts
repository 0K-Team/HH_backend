import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import mongoose from "mongoose";
import "dotenv/config";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

import passport from "passport";
import "./auth/google";
import "./auth/facebook";

import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL as string)

const blobServiceClient: BlobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING || ''
);
const containerClient: ContainerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER_NAME || ''
);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use("/api", routes);

app.use(passport.initialize());
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL as string
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});