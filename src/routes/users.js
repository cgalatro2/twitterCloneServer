const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});

    if (users) {
      res.send({ users: JSON.stringify(users) });
    } else {
      res.status(404).send({ error: "No users not found." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get("/users/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

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
