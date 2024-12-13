const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const subCategoryModel = require("../models/subCategoryModel");
const categoryModel = require("../models/categoryModel");

const setCategoryRoute = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

const createSubCategory = asyncHandler(async (req, res, next) => {
  const mainCategory = req.body.category || req.params.categoryId;
  const categoryExists = await categoryModel.findById(mainCategory);
  if (!categoryExists) {
    return next(
      new ApiError(`No Category Found With This Id: ${mainCategory}`, 404)
    );
  }
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

const getSpecificSubCategory = asyncHandler(async (req, res, next) => {
  const subCategoryId = req.params.id;
  const subCategory = await subCategoryModel
    .findById(subCategoryId)
    .populate({ path: "category", select: "name -_id" });
  if (!subCategory) {
    return next(new ApiError(`No Category For This Id : ${subCategory}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

const getSubCategories = asyncHandler(async (req, res, next) => {
  if (req.filterObject.category) {
    const categoryExists = await categoryModel.findById(
      req.filterObject.category
    );
    if (!categoryExists) {
      return next(
        new ApiError(
          `No Category Found With This Id: ${req.filterObject.category}`,
          404
        )
      );
    }
  }
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;
  const subCategories = await subCategoryModel
    .find(req.filterObject)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

const updateSubCategory = asyncHandler(async (req, res, next) => {
  const subCategoryId = req.params.id;
  const subCategoryName = req.body.name;
  const mainCategory = req.body.category;

  const categoryExists = await categoryModel.findById(mainCategory);
  if (!categoryExists) {
    return next(
      new ApiError(`No Category Found With This Id: ${mainCategory}`, 404)
    );
  }
  const subCategory = await subCategoryModel.findOneAndUpdate(
    { _id: subCategoryId },
    {
      name: subCategoryName,
      slug: slugify(subCategoryName),
      category: mainCategory,
    },
    { new: true }
  );
  if (!subCategory) {
    return next(
      new ApiError(`no subCategory for this id : ${subCategoryId}`, 404)
    );
  }
  res.status(200).json({ data: subCategory });
});

const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategoryId = req.params.id;

  const subCategory = await subCategoryModel.findOneAndDelete({
    _id: subCategoryId,
  });
  if (!subCategory) {
    return next(
      new ApiError(`No subCategory For This Id : ${subCategoryId}`, 404)
    );
  }
  res.status(202).json({ msg: `subCategory Deleted Successfully` });
});

module.exports = {
  createSubCategory,
  getSpecificSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryRoute,
  createFilterObject,
};
