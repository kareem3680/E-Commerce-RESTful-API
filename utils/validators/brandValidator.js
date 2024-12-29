const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const asyncHandler = require("express-async-handler");
const ApiError = require("../apiError");
const brandController = require("../../Controller/brandController");
const brandModel = require("../../models/brandModel");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleWare,
];

exports.createBrandValidator = [
  brandController.uploadBrandImage,
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters")
    .custom((value, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(value);
      }
      return true;
    }),
  validatorMiddleWare,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleWare,
];

exports.updateBrandValidator = [
  brandController.uploadBrandImage,
  check("id")
    .isMongoId()
    .withMessage("Invalid Brand Id Format")
    .custom(
      asyncHandler(async (id, { req }) => {
        const documentId = req.params.id;
        const exists = await brandModel.findById(id);
        if (!exists) {
          throw new ApiError(`No document For This Id: ${documentId}`, 404);
        }
        return true;
      })
    ),
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
  validatorMiddleWare,
];
