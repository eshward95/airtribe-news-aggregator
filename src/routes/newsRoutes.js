const express = require("express");
const newsController = require("../controllers/newsController");
const authJWT = require("../middleware/authJWT");
const router = express.Router();

router.use(authJWT.protect);
router.route("/").get(newsController.getNews);
router.route("/search/:keyword").get(newsController.getNewsByQuery);

router.route("/read").get(newsController.getReadNews);
router.route("/:id/read").post(newsController.updateReadStatus);

router.route("/favorite").get(newsController.getFavoriteNews);
router.route("/:id/favorite").post(newsController.updateFavoriteStatus);

module.exports = router;
