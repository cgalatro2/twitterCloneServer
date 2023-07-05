require("./models/user");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

const requireAuth = require("./middlewares/requireAuth");

const tweetRoutes = require("./routes/tweets");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());
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
app.get("/", requireAuth, async function (req, res) {
  res.send(`Your email: ${req.user.email}`);
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
