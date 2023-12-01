const express = require("express");
const mongoose = require("mongoose");
const Tweet = mongoose.model("Tweet");
const Comment = mongoose.model("Comment");

const router = express.Router();

router.get("/tweets", async (_req, res) => {
  const tweets = await Tweet.find({})
    .sort({ createdAt: -1 })
    .populate("user")
    .exec();
  res.json(tweets);
});

router.get("/tweets/:user", async (req, res) => {
  const { user } = req.params;
  try {
    const tweets = await Tweet.find({ user })
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();
    res.send(tweets);
  } catch (err) {
    res.status(404).send({
      error: `Cannot find tweets for this user. Error: ${err.message}`,
    });
  }
});

router.get("/tweet/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const tweet = await Tweet.findOne({ _id })
      .populate("user")
      .populate({
        path: "comments",
        model: "Comment",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .exec();
    res.send(tweet);
  } catch (err) {
    res.status(404).send({
      error: `Cannot find this tweet. Error: ${err.message}`,
    });
  }
});

router.get("/tweets/likes/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const tweet = await Tweet.findOne({ _id }).populate("likes").exec();
    res.send(tweet.likes);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post("/tweets", async (req, res) => {
  const { content, user } = req.body;

  if (!content || !user) {
    return res.status(418).send({ error: "Must provide content and userId." });
  }

  try {
    const tweet = new Tweet({
      content,
      user,
    });
    await tweet.save();
    res.send(tweet);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post("/tweets/:_id/like", async (req, res) => {
  const { _id } = req.params;
  const { user } = req.body;

  if (!_id || !user) {
    return res.status(418).send({ error: "Must provide tweet _id and user." });
  }

  try {
    const tweet = await Tweet.findOne({ _id });
    if (tweet.likes.includes(user)) {
      return res
        .status(418)
        .send({ error: "Tweet already liked by this user" });
    }
    tweet.likes.push(user);
    tweet.save();
    res.send(tweet);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
});

router.post("/tweets/:_id/unlike", async (req, res) => {
  const { _id } = req.params;
  const { user } = req.body;

  if (!_id || !user) {
    return res.status(418).send({ error: "Must provide tweet _id and user." });
  }

  try {
    const update = await Tweet.updateOne(
      { _id },
      { $pull: { likes: user } },
      { new: true }
    );
    res.send(update);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.get("/tweets/:_id/comments", async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(400).send({ error: "Must provide tweet ID." });
  }

  try {
    const tweet = await Tweet.findOne({ _id })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      })
      .exec();
    res.send(tweet.comments);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post("/tweets/:_id/comment", async (req, res) => {
  const { _id } = req.params;
  const { content, user } = req.body;

  if (!content || !_id || !user) {
    return res
      .status(400)
      .send({ error: "Must provide content, tweet ID, and user." });
  }

  try {
    const comment = new Comment({
      content,
      user,
      tweet: _id,
    });
    await comment.save();

    const tweet = await Tweet.findOne({ _id });
    tweet.comments.push(comment._id);
    tweet.save();
    res.send(tweet);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
