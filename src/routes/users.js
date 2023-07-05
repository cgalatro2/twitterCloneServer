const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/users", async (_req, res) => {
  const users = await User.find({});

  res.json(users);
});

module.exports = router;
