const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(422)
      .send({ error: "Must provide username, email and password." });
  }

  try {
    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
    res.send({ token, user: JSON.stringify(user) });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ error: "Email not found." });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
    res.send({ token, user: JSON.stringify(user) });
  } catch (err) {
    return res.status(404).send({ error: "Inavlid email and/or password." });
  }
});

module.exports = router;
