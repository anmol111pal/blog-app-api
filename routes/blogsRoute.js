const path = require("path");
const express = require("express");
const { getBlog, getAllBlogs, getMyBlogs, write } = require("../controllers/blogController.js");

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/my", getMyBlogs);
router.post("/write", write);

router.get("/:id", getBlog);

module.exports = router;