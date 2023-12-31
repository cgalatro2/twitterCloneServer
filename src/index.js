require("./models/user");
require("./models/tweet");
require("./models/comment");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

const tweetRoutes = require("./routes/tweets");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/auth");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(requireAuth);
app.use(tweetRoutes);
app.use(userRoutes);
app.use(commentRoutes);

mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitterclone.e04lesz.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

mongoose.connection.on("error", function (error) {
  console.log(error);
});

mongoose.connection.on("open", function () {
  console.log("Connected to MongoDB database.");
});

const port = 3000;
app.get("/", async function (_req, res) {
  res.send(`hey there!`);
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
