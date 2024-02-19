const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

const User = require("../models/User");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get("/register", (req, res) => {
  res.render("register", { user: req.user });
});

router.get("/requestPasswordReset", (req, res) => {
  res.render("requestPasswordReset", { user: req.user });
});

router.get("/resetPassword", (req, res) => {
  res.render("resetPassword", { user: req.user });
});

router.post("/register", async (req, res) => {
  const { username, password, confPassword, securityQuestion, securityAnswer } =
    req.body;

  if (!username || !password || !confPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const newUser = new User({
      username: username,
      password: password,
      securityQuestion: securityQuestion,
      securityAnswer: hashedSecurityAnswer,
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);

    newUser.password = hash;

    await newUser.save();

    res.status(200).json({ message: "User Created Successfully!!" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin/",
    failureRedirect: "/auth/login",
  })(req, res, next);
});

router.post("/requestPasswordReset", async (req, res) => {
  const { username, securityQuestion, securityAnswer } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user || user.securityQuestion !== securityQuestion) {
      return res.status(400).json({ message: "Invalid security question" });
    }

    const isAnswerCorrect = await bcrypt.compare(
      securityAnswer,
      user.securityAnswer
    );

    if (!isAnswerCorrect) {
      return res.status(400).json({ message: "Invalid security answer" });
    }

    // Store username in the session
    req.session.username = username;

    // Redirect to createNewPassword route if username and security answer are correct
    res.redirect("/auth/resetPassword");
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
});

router.post("/resetPassword", async (req, res) => {
  const { newPassword, confNewPassword } = req.body;

  // Validate and process the password reset data
  if (!newPassword || !confNewPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== confNewPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const username = req.session.username;

    if (!username) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;
    await user.save();

    req.session.destroy();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect("/");
  });
});

module.exports = router;
