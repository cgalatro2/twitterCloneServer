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
  try {
    const tweets = await Tweet.find({ username: req.params.username });
    res.send(tweets);
  } catch (err) {
    console.log(err);
  }
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
    res.send(tweet);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post("/tweets/:_id/like", async (req, res) => {
  const { _id } = req.params;
  const { userId } = req.body;

  if (!_id || !userId) {
    return res
      .status(418)
      .send({ error: "Must provide tweet _id and userId." });
  }

  try {
    const tweet = await Tweet.findOne({ _id });
    tweet.likes.push(userId);
    tweet.save();
    res.send(tweet);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post("/tweets/:_id/unlike", async (req, res) => {
  const { _id } = req.params;
  const { userId } = req.body;

  if (!_id || !userId) {
    return res
      .status(418)
      .send({ error: "Must provide tweet _id and userId." });
  }

  try {
    const update = await Tweet.updateOne(
      { _id },
      { $pull: { likes: userId } },
      { new: true }
    );
    res.send(update);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
