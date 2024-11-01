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
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL as string)

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());


app.set('trust proxy', 1);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookie());
app.use(passport.initialize());

app.use("/v1/", routes);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "EcoHero Express API with Swagger",
      version: "1.0.0",
      description: "EcoHero API documented with Swagger",
    },
    servers: [
      {
        url: "https://eco-docs.q1000q.me/v1",
      },
    ],
  },
  apis: ["./docs/*.yaml"], // Path to your YAML file
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});