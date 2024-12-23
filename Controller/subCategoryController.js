const controllerHandler = require("./controllerHandler");
const subCategoryModel = require("../models/subCategoryModel");

exports.setCategoryRoute = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.getSpecificSubCategory =
  controllerHandler.getSpecific(subCategoryModel);

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

exports.getSubCategories = controllerHandler.getAll(subCategoryModel);

exports.createSubCategory = controllerHandler.create(subCategoryModel);

exports.updateSubCategory = controllerHandler.update(subCategoryModel);

exports.deleteSubCategory = controllerHandler.delete(subCategoryModel);
