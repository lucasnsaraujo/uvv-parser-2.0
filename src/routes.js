import { Router } from "express";

import PostController from "./controllers/PostController.js";

const router = Router();

router.get("/api/posts/:id", PostController.show);
router.get("/", (req, res) => {
  res.send(
    "<h2>VAI PRA /api/posts/{ID_DE_ALGUM_POST}</h2><h2>ou /api/posts/last PARA O ULTIMO POST NO BANCO</h2>"
  );
});
router.get("/api/posts/last", PostController.lastPost);

export default router;
