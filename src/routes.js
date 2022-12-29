import { Router } from "express";

import PostController from "./controllers/PostController.js";

const router = Router();

router.get("/api/posts", PostController.index);
router.get("/", (req, res) => {
  res.send(
    '<a href="https://uvv.up.railway.app/api/posts">CLICA AQUI MANITO</a>'
  );
});

export default router;
