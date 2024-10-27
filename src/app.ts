import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import mongoose from "mongoose";
import "dotenv/config";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});