const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/users", async (_req, res) => {
  try {
    const users = await User.find({});

    if (users) {
      res.send({ users });
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
      res.send({ user });
    } else {
      res.status(404).send({ error: "User not found." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post("/follow/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const { followingUsername } = req.body;
    const userToFollow = await User.findOne({ username });
    const followingUser = await User.findOne({ username: followingUsername });

    if (userToFollow && followingUser) {
      // add the id of the user you want to follow in following array
      const newFollowers = [...userToFollow.followers, followingUser._id];

      const update = {
        followers: newFollowers,
      };
      const updated = await User.updateOne({ username }, update, { new: true });

      // add your id to the followers array of the user you want to follow
      const newFollowing = [...followingUser.following, userToFollow._id];

      const secondUpdate = {
        following: newFollowing,
      };
      const secondUpdated = await User.updateOne(
        { _id: followingUser._id },
        secondUpdate
      );

      if (!updated || !secondUpdated) {
        return res.status(404).json({ error: "Unable to follow that user" });
      }

      res.status(200).json(updated);
    } else {
      res.status(404).send({ error: "User not found." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post("/unfollow/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const { unfollowingUsername } = req.body;
    const userToUnfollow = await User.findOne({ username });
    const unfollowingUser = await User.findOne({
      username: unfollowingUsername,
    });

    if (userToUnfollow && unfollowingUser) {
      const update = await User.updateOne(
        { username },
        { $pull: { followers: unfollowingUser._id } }
      );

      const secondUpdate = await User.updateOne(
        { username: unfollowingUsername },
        { $pull: { following: userToUnfollow._id } }
      );

      if (!update || !secondUpdate) {
        return res.status(404).json({ error: "Unable to follow that user" });
      }

      res.status(200).json(update);
    } else {
      res.status(404).send({ error: "User not found." });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
