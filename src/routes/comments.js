const express = require("express");
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");

const router = express.Router();

router.post("/comments/:_id/like", async (req, res) => {
  const { _id } = req.params;
  const { user } = req.body;

  if (!_id || !user) {
    return res.status(418).send({ error: "Must provide tweet and user IDs." });
  }

  try {
    const comment = await Comment.findOne({ _id });
    if (comment.likes.includes(user)) {
      res.status(420).send({ error: "This user already liked this comment" });
    } else {
      comment.likes.push(user);
      comment.save();
      res.send(comment);
    }
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post("/comments/:_id/unlike", async (req, res) => {
  const { _id } = req.params;
  const { user } = req.body;

  if (!_id || !user) {
    return res.status(418).send({ error: "Must provide tweet _id and user." });
  }

  try {
    const update = await Comment.updateOne(
      { _id },
      { $pull: { likes: user } },
      { new: true }
    );
    res.send(update);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
