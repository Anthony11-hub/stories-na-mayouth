const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/programs", (req, res) => {
  res.render("programs");
});

router.get("/program-description", (req, res) => {
  res.render("program-description");
});

router.get("/events", (req, res) => {
  res.render("events");
});

router.get("/event-description", (req, res) => {
  res.render("event-description");
});

router.get("/market", (req, res) => {
  res.render("market");
});

router.get("/product-detail", (req, res) => {
  res.render("product-detail");
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

module.exports = router;
