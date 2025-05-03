import { Router } from "express";
import { getBlog, getAllBlogs, getMyBlogs, write } from "../controllers/blogController.js";

const router = Router();

router.get("/", getAllBlogs);
router.get("/my", getMyBlogs);
router.post("/write", write);

router.get("/:id", getBlog);

export default router;