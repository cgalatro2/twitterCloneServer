const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const tweetRoutes = require("./routes/tweets");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const express = require("express");
const app = express();

app.use(tweetRoutes);
app.use(userRoutes);
app.use(authRoutes);

const User = require("./models/user");

// setting up db

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

// setting up server

const port = 3000;
app.get("/", async function (_req, res) {
  const users = await User.find();

  res.json(users);
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
