import express, { Express } from "express";
import dotenv from "dotenv";
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
import { GardenHandler } from "./handlers/GardenHandler";

import ews from "express-ws"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

ews(app);

import routes from "./routes";

mongoose.connect(process.env.MONGODB_URL as string)

app.use(cors());

app.set('trust proxy', 1);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookie());
app.use(passport.initialize());

app.use("/v1/", routes);

app.use((_, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

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
            url: "https://ecohero.q1000q.me/api/v1",
        },
        {
            url: "https://eco-docs.q1000q.me/api/v1",
        },
        {
            url: "https://ecoheroapi.q1000q.me/api/v1",
        },
        ],
    },
    apis: ["./docs/*.yaml"], // Path to your YAML file
};

export const gardenHandler = new GardenHandler();

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});