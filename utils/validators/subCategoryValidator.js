const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category Id is required")
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleWare,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters"),
  check("category")
    .notEmpty()
    .withMessage("Category name is required")
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleWare,
];

exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category Id is required")
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleWare,
];

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category Id is required")
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  check("category")
    .notEmpty()
    .withMessage("Category name is required")
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleWare,
];
