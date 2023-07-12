const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const authJWT = require("../middleware/authJWT");
const {
  validate,
  userValidationRules,
  preferenceValidationRules,
} = require("../validator/validator");

const router = express.Router();

router.route("/users").get(authJWT.protect, userController.getUsers);

router
  .route("/preference")
  .all(authJWT.protect)
  .get(userController.getPreference)
  .put(
    preferenceValidationRules(),
    validate,
    userController.updateUserPreference
  );

router
  .route("/register")
  .post(userValidationRules(), validate, authController.signUp);
router.route("/login").post(authController.login);

module.exports = router;
