const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  content: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  timestamp: Date,
});

module.exports = mongoose.model("Tweet", TweetSchema);
