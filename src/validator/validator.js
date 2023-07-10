const { body, validationResult } = require("express-validator");
const { checkAlreadyEmailExists } = require("../helpers/validationHelpers");

exports.userValidationRules = () => {
  const roleEnums = ["admin", "user"];
  return [
    // username must be an email
    body("name").notEmpty().withMessage("name is required"),
    body("email")
      .isEmail()
      .withMessage("Enter valid email")
      .custom((email) => {
        if (email && checkAlreadyEmailExists(email))
          throw new Error(`Email already exists`);
        return true;
      }),
    body("preference").default("general"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .custom((value) => {
        if (value && !roleEnums.includes(value)) {
          throw new Error(`Must be one of ${roleEnums}`);
        }
        return true;
      }),
    // password must be at least 5 chars long
    body("preferences").optional().isLength({ min: 3 }),
  ];
};

exports.preferenceValidationRules = () => {
  const preferencesEnum = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];
  return [
    body("preference")
      .notEmpty()
      .withMessage("Please add valid key")
      .custom((value) => {
        if (
          value &&
          !value.every((preference) => preferencesEnum.includes(preference))
        ) {
          throw new Error(`Must be one of ${preferencesEnum}`);
        }
        return true;
      }),
  ];
};

exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
  return res.status(422).json({ message: "failed", errors: extractedErrors });
};