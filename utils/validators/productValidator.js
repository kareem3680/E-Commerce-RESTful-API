/* eslint-disable eqeqeq */
const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ApiError = require("../apiError");
const categoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");
const brandModel = require("../../models/brandModel");
const productModel = require("../../models/productModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((value, { req }) => {
      if (req.body.title) {
        req.body.slug = slugify(value);
      }
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Product price must be lower than original price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (categoryId) => {
      const categoryExists = await categoryModel.findById(categoryId);
      if (!categoryExists) {
        return Promise.reject(
          new ApiError(`No category found with this ID: ${categoryId}`, 404)
        );
      }
    }),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (subCategories) => {
      const subCategoriesExists = await subCategoryModel.find({
        _id: { $exists: true, $in: subCategories },
      });
      if (
        subCategoriesExists.length < 1 ||
        subCategoriesExists.length !== subCategories.length
      ) {
        return Promise.reject(
          new ApiError(
            `One or more subCategories do not found with this ID: ${subCategories}`,
            404
          )
        );
      }
    })
    .custom(async (subCategories, { req }) => {
      const subCategoriesExists = await subCategoryModel.find({
        _id: { $exists: true, $in: subCategories },
        category: req.body.category,
      });
      if (
        subCategoriesExists.length < 1 ||
        subCategoriesExists.length !== subCategories.length
      ) {
        return Promise.reject(
          new ApiError(
            `One or more subCategories do not belong to the specified category`,
            404
          )
        );
      }
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (brand) => {
      const brandExists = await brandModel.findById(brand);
      if (!brandExists) {
        return Promise.reject(
          new ApiError(`No brand found with this ID: ${brand}`, 404)
        );
      }
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .optional()
    .custom((value, { req }) => {
      if (req.body.title) {
        req.body.slug = slugify(value);
      }
      return true;
    }),
  check("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom(async (value, { req }) => {
      const product = await productModel.findById(req.params.id);
      if (
        req.body.priceAfterDiscount &&
        req.body.priceAfterDiscount >= product.price
      ) {
        return Promise.reject(
          new ApiError(
            `priceAfterDiscount cannot be greater than or equal to the original price (${product.price})`,
            400
          )
        );
      }
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be array of string"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (categoryId) => {
      const categoryExists = await categoryModel.findById(categoryId);
      if (!categoryExists) {
        return Promise.reject(
          new ApiError(`No category found with this ID: ${categoryId}`, 404)
        );
      }
    }),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (subCategories) => {
      const subCategoriesExists = await subCategoryModel.find({
        _id: { $exists: true, $in: subCategories },
      });
      if (
        subCategoriesExists.length < 1 ||
        subCategoriesExists.length !== subCategories.length
      ) {
        return Promise.reject(
          new ApiError(
            `One or more subCategories do not found with this ID: ${subCategories}`,
            404
          )
        );
      }
    })
    .custom(async (subCategories, { req }) => {
      const product = await productModel.findById(req.params.id);
      const subCategoriesExists = await subCategoryModel.find({
        _id: { $exists: true, $in: subCategories },
        category: product.category,
      });
      if (
        subCategoriesExists.length < 1 ||
        subCategoriesExists.length !== subCategories.length
      ) {
        return Promise.reject(
          new ApiError(
            `One or more subCategories do not belong to the specified category`,
            404
          )
        );
      }
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (brand) => {
      const brandExists = await brandModel.findById(brand);
      if (!brandExists) {
        return Promise.reject(
          new ApiError(`No brand found with this ID: ${brand}`, 404)
        );
      }
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
