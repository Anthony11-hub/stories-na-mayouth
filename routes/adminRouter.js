const express = require("express");
const router = express.Router();

const authCheck = require("../middleware/loggedIn");

router.get("/", authCheck, (req, res) => {
  res.render("dashboard", { user: res.user });
});

router.get("/products", authCheck, (req, res) => {
  res.render("products", { user: req.user });
});

router.get("/upload", authCheck, (req, res) => {
  res.render("upload", { user: req.user });
});

module.exports = router;
