const CustomError = require("../helpers/CustomError");

//Basic implementation of rate limiter

//We are creating a simple hashMap mapping the IP address
//with number of requests
const requestMap = {};

//The maximum number of requests
//that can be done in a minute
const MAX_REQUESTS_PER_MINUTE = 10;
exports.rateLimit = (req, res, next) => {
  const ipAddress = req.ip;
  if (
    requestMap[ipAddress] &&
    requestMap[ipAddress] > MAX_REQUESTS_PER_MINUTE
  ) {
    return next(new CustomError("Too many requests", 400));
  }
  requestMap[ipAddress] = (requestMap[ipAddress] || 0) + 1;
  //A timeout to set the count to 0 after 2 second
  setTimeout(() => {
    requestMap[ipAddress] = 0;
  }, 2000);
  next();
};
