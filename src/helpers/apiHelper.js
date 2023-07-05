const axios = require("axios");
exports.makeApiCall = async (url, method, data = null, headers = {}) => {
  const config = { method, url, data, headers };
  try {
    const response = await axios(config);
    return response.data;
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
};
