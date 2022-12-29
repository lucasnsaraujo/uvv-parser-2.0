import { Router } from "express";

import PostController from "./controllers/PostController.js";
import SubjectController from "./controllers/SubjectController.js";
import TeacherController from "./controllers/TeacherController.js";

const router = Router();

router.get("/posts", PostController.index);
router.post("/posts", PostController.store);
router.get("/teachers", TeacherController.index);
router.post("/teachers", TeacherController.store);
router.post("/subjects", SubjectController.store);
router.get("/subjects", SubjectController.index);

export default router;
