import { Router } from "express";
import LocationSchema from "../schemas/locations";

const router = Router();

router.get("/", async (_req, res) => {
    const locations = await LocationSchema.find();

    res.send(locations);
});

export default router;