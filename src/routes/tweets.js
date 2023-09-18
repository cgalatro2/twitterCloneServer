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
  const { content, username } = req.body;

  if (!content || !username) {
    return res
      .status(418)
      .send({ error: "Must provide content and username." });
  }

  try {
    const tweet = new Tweet({
      content,
      username,
      timestamp: Date.now(),
    });
    await tweet.save();
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
