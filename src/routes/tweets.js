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

router.post("/tweets", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(422).send({ error: "Must provide content and userId." });
  }

  try {
    const tweet = new Tweet({ content, timestamp: Date.now() });
    await tweet.save();
    res.send(tweet);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
