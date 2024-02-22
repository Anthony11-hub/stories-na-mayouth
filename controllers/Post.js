const Post = require("../models/Post");

const { uploadFile } = require("../controllers/s3");

// unlinking the files from the uploads folder
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const getAllPosts = async (req, res) => {
  try {
    const { name, category, fields, sort, numericFilters } = req.query;
    const queryObject = {};

    if (name) {
      queryObject.productTitle = { $regex: name, $options: "i" };
    }

    if (category) {
      queryObject.productCategory = category;
    }

    if (numericFilters) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };
      const regEx = /\b(<|>|>=|=|<|<=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const options = ["productPrice"];
      filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) };
        }
      });
    }

    let result = Post.find(queryObject);

    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("createdAt");
    }

    if (fields) {
      const fieldList = fields.split(",").join(" ");
      result = result.select(fieldList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // result = result.skip(skip).limit(limit);

    const posts = await result;

    // Count total number of products without skipping and limiting
    const totalProducts = await Post.countDocuments(queryObject);

    res.status(200).json({ data: posts, totalProducts: totalProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ data: post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const postData = req.body;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return uploadFile(file).then((result) => {
          // Add the file path to the result object for later use
          return { result, filePath: file.path };
        });
      });

      // Wait for all uploads to complete
      const s3UploadResults = await Promise.all(uploadPromises);

      // Unlink the files from the local server
      await Promise.all(
        s3UploadResults.map(({ filePath }) => unlinkFile(filePath))
      );

      // Update the postData with S3 file URLs
      postData.productImage = s3UploadResults.map(
        ({ result }) => result.Location
      );
    }

    const post = await Post.create(postData);
    res.status(201).json({ data: post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    console.log(post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ data: post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ data: post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
};
