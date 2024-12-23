const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const ApiError = require("../apiError");
const categoryModel = require("../../models/categoryModel");

exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory Id is required")
    .isMongoId()
    .withMessage("Invalid SubCategory Id Format"),
  validatorMiddleWare,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters")
    .custom((value, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(value);
      }
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category name is required")
    .isMongoId()
    .withMessage("Invalid Category Id Format")
    .custom(async (categoryId) => {
      const categoryExists = await categoryModel.findById(categoryId);
      if (!categoryExists) {
        return Promise.reject(
          new ApiError(`No category found with this ID: ${categoryId}`, 404)
        );
      }
    }),
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
  check("name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .optional()
    .custom((value, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(value);
      }
      return true;
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category Id Format")
    .custom(async (categoryId) => {
      const categoryExists = await categoryModel.findById(categoryId);
      if (!categoryExists) {
        return Promise.reject(
          new ApiError(`No category found with this ID: ${categoryId}`, 404)
        );
      }
    }),
  validatorMiddleWare,
];
