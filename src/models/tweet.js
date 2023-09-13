const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  content: String,
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  username: String,
  timestamp: Date,
});

module.exports = mongoose.model("Tweet", TweetSchema);
