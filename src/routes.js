import { Router } from "express";

import PostController from "./controllers/PostController.js";

const router = Router();

router.get("/api/saulo", PostController.saulo )
router.get("/api/posts/:id", PostController.show);
router.get("/", (req, res) => {
  res.send(
    "<h2>VAI PRA /api/posts/{ID_DE_ALGUM_POST}</h2><h2>ou /api/posts/0 PARA O ULTIMO POST NO BANCO</h2>"
  );
});
router.get("/api/posts/0", PostController.lastPost);

export default router;
