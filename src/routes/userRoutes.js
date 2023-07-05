const express = require("express");
const userData = require("../../dev-db/users.json");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  validate,
  userValidationRules,
  preferenceValidationRules,
} = require("../validator/validator");

const router = express.Router();

router.route("/users").get(authController.protect, userController.getUsers);

router
  .route("/preference")
  .all(authController.protect)
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
