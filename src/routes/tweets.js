const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const mongoose = require("mongoose");
const Tweet = mongoose.model("Tweet");

const router = express.Router();

// router.use(requireAuth);

router.get("/tweets", async (_req, res) => {
  const tweets = await Tweet.find({});
  res.json(tweets);
});

router.get("/tweets/:username", async (req, res) => {
  const tweets = await Tweet.find({ username: req.params.username });
  res.json(tweets);
});

router.post("/tweets", async (req, res) => {
  const { content, userId, username } = req.body;

  if (!content || !userId || !username) {
    return res
      .status(422)
      .send({ error: "Must provide content, username and userId." });
  }

  try {
    const tweet = new Tweet({
      content,
      userId,
      username,
      timestamp: Date.now(),
    });
    await tweet.save();
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
