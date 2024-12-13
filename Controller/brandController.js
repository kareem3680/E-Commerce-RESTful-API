const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const brandModel = require("../models/brandModel");

const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await brandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

const getSpecificBrand = asyncHandler(async (req, res, next) => {
  const brandId = req.params.id;
  const brand = await brandModel.findById(brandId);
  if (!brand) {
    return next(new ApiError(`No Brand For This Id : ${brandId}`, 404));
  }
  res.status(200).json({ data: brand });
});

const getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;
  const brands = await brandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

const updateBrand = asyncHandler(async (req, res, next) => {
  const brandId = req.params.id;
  const brandName = req.body.name;

  const brand = await brandModel.findOneAndUpdate(
    { _id: brandId },
    { name: brandName, slug: slugify(brandName) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError(`No Brand For This Id : ${brandId}`, 404));
  }
  res.status(200).json({ data: brand });
});

const deleteBrand = asyncHandler(async (req, res, next) => {
  const brandId = req.params.id;

  const brand = await brandModel.findOneAndDelete({ _id: brandId });
  if (!brand) {
    return next(new ApiError(`No Brand For This Id : ${brandId}`, 404));
  }
  res.status(202).json({ msg: `Brand Deleted Successfully` });
});

module.exports = {
  createBrand,
  getSpecificBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};
