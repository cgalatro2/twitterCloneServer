const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/users", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);

    if (user) {
      res.send({ user: JSON.stringify(user) });
    } else {
      res.status(404).send({ error: "User not found." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get("/users/:username", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findOne({ username: req.params.username });

    if (user) {
      res.send({ user: JSON.stringify(user) });
    } else {
      res.status(404).send({ error: "User not found." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
