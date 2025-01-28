const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");
const productController = require("../../Controller/productController");
const brandModel = require("../../models/brandModel");
const productModel = require("../../models/productModel");

exports.createProductValidator = [
  productController.uploadProductImages,
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
    .withMessage("Too long price")
    .customSanitizer((value) => {
      return Math.ceil(value / 5) * 5;
    }),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .customSanitizer((value) => {
      return Math.ceil(value / 5) * 5;
    })
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        return Promise.reject({
          message: "Product price must be lower than original price",
          statusCode: 404,
        });
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be array of string"),
  check("imageCover").custom((value, { req, next }) => {
    if (!req.files || !req.files.imageCover) {
      return Promise.reject({
        message: "Product imageCover is required",
        statusCode: 404,
      });
    }
    return true;
  }),

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
        return Promise.reject({
          message: `No category found with this ID: ${categoryId}`,
          statusCode: 404,
        });
      }
    }),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (subCategories) => {
      if (typeof subCategories === "string") {
        subCategories = [subCategories];
      }
      const subCategoriesExists = await subCategoryModel.find({
        _id: { $exists: true, $in: subCategories },
      });
      if (
        subCategoriesExists.length < 1 ||
        subCategoriesExists.length !== subCategories.length
      ) {
        return Promise.reject({
          message: `One or more subCategories do not found with this ID: ${subCategories}`,
          statusCode: 404,
        });
      }
    })
    .custom(async (subCategories, { req }) => {
      if (typeof subCategories === "string") {
        subCategories = [subCategories];
      }
      const subCategoriesExists = await subCategoryModel.find({
        _id: { $exists: true, $in: subCategories },
        category: req.body.category,
      });
      if (
        subCategoriesExists.length < 1 ||
        subCategoriesExists.length !== subCategories.length
      ) {
        return Promise.reject({
          message: `One or more subCategories do not belong to the specified category`,
          statusCode: 404,
        });
      }
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (brand) => {
      const brandExists = await brandModel.findById(brand);
      if (!brandExists) {
        return Promise.reject({
          message: `No brand found with this ID: ${brand}`,
          statusCode: 404,
        });
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
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  productController.uploadProductImages,
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
    .withMessage("Too long price")
    .customSanitizer((value) => {
      return Math.ceil(value / 5) * 5;
    }),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .customSanitizer((value) => {
      return Math.ceil(value / 5) * 5;
    })
    .custom(async (value, { req }) => {
      const product = await productModel.findById(req.params.id);
      if (
        req.body.priceAfterDiscount &&
        req.body.priceAfterDiscount >= product.price
      ) {
        return Promise.reject({
          message: `priceAfterDiscount cannot be greater than or equal to the original price ${product.price}`,
          statusCode: 404,
        });
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
        return Promise.reject({
          message: `No category found with this ID: ${categoryId}`,
          statusCode: 404,
        });
      }
    }),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (subCategories) => {
      if (typeof subCategories === "string") {
        subCategories = [subCategories];
      }
      const subCategoriesExists = await subCategoryModel.find({
        _id: { $exists: true, $in: subCategories },
      });
      if (
        subCategoriesExists.length < 1 ||
        subCategoriesExists.length !== subCategories.length
      ) {
        return Promise.reject({
          message: `One or more subCategories do not found with this ID: ${subCategories}`,
          statusCode: 404,
        });
      }
    })
    .custom(async (subCategories, { req }) => {
      if (typeof subCategories === "string") {
        subCategories = [subCategories];
      }
      const product = await productModel.findById(req.params.id);
      if (!product) {
        return Promise.reject({
          message: `No document For This Id: ${req.params.id}`,
          statusCode: 404,
        });
      }
      const category = await categoryModel.findOne(product.category);
      if (!category) {
        return Promise.reject({
          message: `Category with name ${product.category} not found`,
          statusCode: 404,
        });
      }
      const subCategoriesExists = await subCategoryModel.find({
        _id: { $exists: true, $in: subCategories },
        category: category.id,
      });
      if (
        subCategoriesExists.length < 1 ||
        subCategoriesExists.length !== subCategories.length
      ) {
        return Promise.reject({
          message: `One or more subCategories do not belong to the specified category`,
          statusCode: 404,
        });
      }
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (brand) => {
      const brandExists = await brandModel.findById(brand);
      if (!brandExists) {
        return Promise.reject({
          message: `No brand found with this ID: ${brand}`,
          statusCode: 404,
        });
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
