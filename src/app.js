const express = require("express");
const CustomError = require("./helpers/CustomError");
const globalErrorHandler = require("./controllers/errorController");
// require("./helpers/cron");

const userRoutes = require("./routes/userRoutes");
const newsRoutes = require("./routes/newsRoutes");
const cronMiddleware = require("./helpers/cron");
const { protect } = require("./controllers/authController");

const app = express();

app.use(express.json());

app.use("/", userRoutes);
app.use("/news", newsRoutes);

app.all("/", (req, res) => {
  res
    .status(200)
    .send({ message: "success", data: "Welcome to news assignment" });
});
app.all("*", (req, res, next) => {
  //Build in constructor
  next(new CustomError("Route not defined", 404));
  //   res.status(404).send({ message: "Failed", data: "Route not defined" });
});
//Passing err will make it error handling middleware
//Express will recognise and call whenever there is error
app.use(globalErrorHandler);

module.exports = app;
