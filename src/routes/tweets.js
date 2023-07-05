const express = require("express");
const router = express.Router();

const Tweet = require("../models/tweet");

router.get("/tweets", async function (_req, res) {
  const tweets = await Tweet.find({});

  res.json(tweets);
});

module.exports = router;
