const { makeApiCall } = require("../helpers/apiHelper");
const { setCacheItem } = require("../helpers/lruCache");

exports.getNewsHelper = async (preference) => {
  const apiUrl = `https://newsapi.org/v2/top-headlines?category=${preference}`;
  const headers = { "X-Api-key": process.env.NEWS_API_KEY };
  const data = await makeApiCall(apiUrl, "get", null, headers);
  const newData = data.articles.reduce((acc, obj) => {
    obj.id =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(10);
    acc.push(obj);
    return acc;
  }, []);
  setCacheItem(preference, newData);
  return newData;
};
