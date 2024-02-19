const express = require("express");

const multer = require("multer");
const mime = require("mime-types");

const router = express.Router();
const {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/Post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "posts");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Get the original file extension from the MIME type
    const extension = mime.extension(file.mimetype);

    // Use the original extension if available, otherwise generate one
    const finalExtension = extension ? `.${extension}` : "";

    cb(null, file.fieldname + "-" + uniqueSuffix + finalExtension);
  },
});

const upload = multer({ storage: storage });

router.get("/", getAllPosts);
router.post("/", upload.array("images", 4), createPost);
router.get("/:id", getSinglePost);
router.patch("/:id", upload.none(), updatePost);
router.delete("/:id", deletePost);

module.exports = router;
