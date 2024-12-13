const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const categoryModel = require("../models/categoryModel");
const subCategoryModel = require("../models/subCategoryModel");
const brandModel = require("../models/brandModel");
const productModel = require("../models/productModel");

const createProduct = asyncHandler(async (req, res, next) => {
  const { category } = req.body;
  const { subCategory } = req.body;
  const { brand } = req.body;
  if (category) {
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return next(
        new ApiError(`No category found with this ID: ${category}`, 404)
      );
    }
  }
  if (subCategory) {
    const subCategoryExists = await subCategoryModel.findById(subCategory);
    if (!subCategoryExists) {
      return next(
        new ApiError(`No sub-category found with this ID: ${subCategory}`, 404)
      );
    }
  }
  if (brand) {
    const brandExists = await brandModel.findById(brand);
    if (!brandExists) {
      return next(new ApiError(`No brand found with this ID: ${brand}`, 404));
    }
  }
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create(req.body);
  res.status(201).json({ data: product });
});

const getSpecificProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = await productModel
    .findById(productId)
    .populate({ path: "category", select: "name -_id" })
    .populate({ path: "subCategory", select: "name -_id" })
    .populate({ path: "brand", select: "name -_id" });
  if (!product) {
    return next(new ApiError(`no category for this id : ${product}`, 404));
  }
  res.status(200).json({ data: product });
});

const getProducts = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;
  const product = await productModel
    .find()
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" })
    .populate({ path: "subCategory", select: "name -_id" })
    .populate({ path: "brand", select: "name -_id" });
  res.status(200).json({ results: product.length, page, data: product });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const { category } = req.body;
  const { subCategory } = req.body;
  const { brand } = req.body;

  if (category) {
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return next(
        new ApiError(`No category found with this ID: ${category}`, 404)
      );
    }
  }
  if (subCategory) {
    const subCategoryExists = await subCategoryModel.findById(subCategory);
    if (!subCategoryExists) {
      return next(
        new ApiError(`No sub-category found with this ID: ${subCategory}`, 404)
      );
    }
  }
  if (brand) {
    const brandExists = await brandModel.findById(brand);
    if (!brandExists) {
      return next(new ApiError(`No brand found with this ID: ${brand}`, 404));
    }
  }
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  if (
    req.body.priceAfterSale &&
    req.body.priceAfterSale > productId.originalPrice
  ) {
    return next(
      new ApiError(`priceAfterSale cannot be greater than originalPrice`, 400)
    );
  }
  const product = await productModel.findOneAndUpdate(
    { _id: productId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    return next(new ApiError(`no category for this id : ${productId}`, 404));
  }
  res.status(200).json({ data: product });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  const product = await productModel.findOneAndDelete({
    _id: productId,
  });
  if (!product) {
    return next(new ApiError(`no product for this id : ${productId}`, 404));
  }
  res.status(202).json({ msg: `product deleted successfully` });
});

module.exports = {
  createProduct,
  getSpecificProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
