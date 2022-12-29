import { Router } from "express";

import PostController from "./controllers/PostController.js";

const router = Router();

router.get("/posts", PostController.index);

export default router;
