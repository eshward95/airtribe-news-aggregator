const CustomError = require("../helpers/CustomError");

//Basic implementation of rate limiter

//We are creating a simple hashMap mapping the IP address
//with number of requests
const requestMap = {};

//The maximum number of requests
const MAX_REQUESTS = 10;
exports.rateLimit = (req, res, next) => {
  const ipAddress =
    req.connection.remoteAddress || req.headers["x-forwarded-for"];
  if (requestMap[ipAddress] && requestMap[ipAddress] > MAX_REQUESTS) {
    return next(new CustomError("Too many requests", 429));
  }
  requestMap[ipAddress] = (requestMap[ipAddress] || 0) + 1;
  //A timeout to reset the count 2 second
  setTimeout(() => {
    requestMap[ipAddress] = 0;
  }, 2000);
  next();
};
