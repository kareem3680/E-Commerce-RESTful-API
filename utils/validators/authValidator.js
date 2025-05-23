const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const asyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .custom((value) =>
      userModel.findOne({ name: value }).then((user) => {
        if (user) {
          return Promise.reject({
            message: "Name already exists",
            statusCode: 403,
          });
        }
      })
    )
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("User name must be at most 32 characters")
    .custom((value, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(value);
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email must be valid")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject({
            message: "Email already exists",
            statusCode: 403,
          });
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirmation) {
        return Promise.reject({
          message: "Passwords do not match",
          statusCode: 403,
        });
      }
      return true;
    }),

  check("passwordConfirmation")
    .notEmpty()
    .withMessage("password confirmation is required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("MobilePhone must be valid"),
  validatorMiddleWare,
];

exports.logInValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .custom(
      asyncHandler(async (value, { req }) => {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
          return Promise.reject({
            message: "E-Mail or password is wrong",
            statusCode: 403,
          });
        }
        const isMatch = await bcrypt.compare(value, user.password);
        if (!isMatch) {
          return Promise.reject({
            message: "E-Mail or password is wrong",
            statusCode: 403,
          });
        }
        return true;
      })
    ),
  validatorMiddleWare,
];
