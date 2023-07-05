const CustomError = require("../helpers/CustomError");
const { makeApiCall } = require("../helpers/apiHelper");
const { readFileHelper, writeFileHelper } = require("../helpers/fileHelpers");
const { getCacheItem } = require("../helpers/lruCache");
const path = require("path");
const { checkIdAlreadyAdded } = require("../helpers/validationHelpers");
const { getNewsHelper } = require("../helpers/getNewshelper");

// const newsPath = path.join(__dirname, "..", "..", "dev-db", "news.json");
const usersPath = path.join(__dirname, "..", "..", "dev-db", "users.json");

const checkId = (val, preference) => {
  const newsData = getCacheItem(preference);
  const news = newsData.find((value) => value.id === val);
  if (!news) {
    return false;
  }
  return news;
};

exports.getNews = async (req, res, next) => {
  try {
    const preference = req.user.hasOwnProperty("preference")
      ? req.user.preference
      : "general";
    let cacheData;
    let fetchType = "";
    cacheData = getCacheItem(preference);
    if (cacheData) {
      fetchType = "cache";
    } else {
      cacheData = await getNewsHelper(preference);
      fetchType = "api";
    }
    return res
      .status(200)
      .json({ result: "success", fetch: fetchType, data: cacheData });
  } catch (err) {
    next(new CustomError(err.message, 404));
  }
};

exports.getNewsByQuery = async (req, res, next) => {
  if (!req.params.keyword) {
    return next(new CustomError("Enter valid keyword", 400));
  }
  const apiUrl = `https://newsapi.org/v2/everything?q=${req.params.keyword}&sortBy=popularity`;
  const headers = { "X-Api-key": process.env.NEWS_API_KEY };
  const data = await makeApiCall(apiUrl, "get", null, headers);
  res.status(200).json({ result: "success", data });
};

exports.getReadNews = (req, res, next) => {
  const preference = req.user.hasOwnProperty("preference")
    ? req.user.preference
    : "general";
  const newsData = getCacheItem(preference);
  if (!newsData) {
    return next(new CustomError("No news data", 404));
  }
  if (!req.user.hasOwnProperty("readarticle")) {
    return next(new CustomError("No read articles", 404));
  }
  res.status(200).json({ result: "success", data: req.user.readarticle });
};

exports.getFavoriteNews = (req, res, next) => {
  const preference = req.user.hasOwnProperty("preference")
    ? req.user.preference
    : "general";

  const newsData = getCacheItem(preference);
  if (!newsData) {
    return next(new CustomError("No news data", 404));
  }
  if (!req.user.hasOwnProperty("favoriteArticle")) {
    return next(new CustomError("No favorite articles", 404));
  }
  res.status(200).json({ result: "success", data: req.user.favoriteArticle });
};

exports.updateReadStatus = async (req, res, next) => {
  try {
    const usersData = readFileHelper(usersPath);
    const user = req.user;
    const content = checkId(req.params.id, user.preference);
    if (!content) {
      return next(new CustomError("No matching id", 400));
    }
    if (user.hasOwnProperty("readarticle") && user.readarticle.length > 0) {
      if (checkIdAlreadyAdded(req.params.id, req.user.readarticle)) {
        return next(new CustomError("Already in read list", 400));
      }
      user.readarticle = [...user.readarticle, content];
    } else {
      user.readarticle = [content];
    }
    const updatedUsers = usersData.map((val) =>
      val._id === user._id ? user : val
    );
    writeFileHelper(usersPath, updatedUsers, () => {
      res.status(200).json({ result: "success", data: user });
    });
  } catch (err) {
    next(new CustomError(err.message, 404));
  }
};
exports.updateFavoriteStatus = async (req, res, next) => {
  try {
    const usersData = readFileHelper(usersPath);
    const user = req.user;
    const content = checkId(req.params.id, user.preference);
    if (!content) {
      return next(new CustomError("No matching id", 400));
    }

    if (
      user.hasOwnProperty("favoriteArticle") &&
      user.favoriteArticle.length > 0
    ) {
      if (checkIdAlreadyAdded(req.params.id, req.user.favoriteArticle)) {
        return next(new CustomError("Already in favorite list", 400));
      }
      user.favoriteArticle = [...user.favoriteArticle, content];
    } else {
      user.favoriteArticle = [content];
    }
    const updatedUsers = usersData.map((val) =>
      val._id === user._id ? user : val
    );
    writeFileHelper(usersPath, updatedUsers, () => {
      res.status(200).json({ result: "success", data: user });
    });
  } catch (err) {
    next(new CustomError(err.message, 404));
  }
};
