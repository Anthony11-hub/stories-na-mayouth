const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();
const {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/Post");

router.get("/", getAllPosts);
router.post("/", upload.array("images", 4), createPost);
router.get("/:id", getSinglePost);
router.patch("/:id", upload.none(), updatePost);
router.delete("/:id", deletePost);

module.exports = router;
