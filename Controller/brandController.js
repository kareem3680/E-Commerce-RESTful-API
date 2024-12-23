const controllerHandler = require("./controllerHandler");
const brandModel = require("../models/brandModel");

exports.createBrand = controllerHandler.create(brandModel);

exports.getSpecificBrand = controllerHandler.getSpecific(brandModel);

exports.getBrands = controllerHandler.getAll(brandModel);

exports.updateBrand = controllerHandler.update(brandModel);

exports.deleteBrand = controllerHandler.delete(brandModel);
