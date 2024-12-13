const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const categoryModel = require("../models/categoryModel");

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await categoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

const getSpecificCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new ApiError(`No Category For This id : ${categoryId}`, 404));
  }
  res.status(200).json({ data: category });
});

const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;
  const categories = await categoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  const categoryName = req.body.name;

  const category = await categoryModel.findOneAndUpdate(
    { _id: categoryId },
    { name: categoryName, slug: slugify(categoryName) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`No Category For This Id : ${categoryId}`, 404));
  }
  res.status(200).json({ data: category });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await categoryModel.findOneAndDelete({ _id: categoryId });
  if (!category) {
    return next(new ApiError(`No Category For This Id : ${categoryId}`, 404));
  }
  res.status(202).json({ msg: `Category deleted successfully` });
});

module.exports = {
  createCategory,
  getSpecificCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
