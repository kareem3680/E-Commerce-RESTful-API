const { check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleWare,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters"),
  validatorMiddleWare,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleWare,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleWare,
];
