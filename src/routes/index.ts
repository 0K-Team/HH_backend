import { Router } from "express";
import userRouter from "./user";
import authRouter from "./auth";
import avatarRouter from "./avatarRouter";
import blogRouter from "./blogRouter";
import postsRouter from "./postsRouter";
import passport from "passport";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const router = Router();

router.use("/user", passport.authenticate("jwt", { session: false} ), userRouter);
router.use("/auth", authRouter);

router.use("/avatar", avatarRouter);

router.use("/blogs", blogRouter);

router.use("/posts", postsRouter);

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
      ],
    },
    apis: [__dirname + "/../docs/*.yaml"],
  };
  
  const specs = swaggerJsdoc(options);
  router.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );

export default router;