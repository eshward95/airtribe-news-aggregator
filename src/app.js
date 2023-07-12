const express = require("express");
const CustomError = require("./helpers/CustomError");
const globalErrorHandler = require("./controllers/errorController");
const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "dev";
console.log("env", env);

dotenv.config({ path: `./${env}.env` });

const userRoutes = require("./routes/userRoutes");
const newsRoutes = require("./routes/newsRoutes");
const morgan = require("morgan");
const { rateLimit } = require("./middleware/rateLimiter");

const app = express();

app.use(express.json());
if (process.env.NODE_ENV != "test") app.use(morgan("dev"));
//Using a rate limiter
//To make max 10 requests in 2 seconds
app.use(rateLimit);
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
