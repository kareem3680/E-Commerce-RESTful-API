const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const controllerHandler = require("./controllerHandler");
const uploadImage = require("../middlewares/uploadImageMiddleware");
const categoryModel = require("../models/categoryModel");

exports.uploadCategoryImage = uploadImage.uploadSingleImage("image", "name");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    const savePath = path.resolve("uploads", "categories");
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(path.resolve(savePath, filename));
    //save image into database
    req.body.image = filename;
  }
  next();
});

exports.createCategory = controllerHandler.create(categoryModel);

exports.getSpecificCategory = controllerHandler.getSpecific(categoryModel);

exports.getCategories = controllerHandler.getAll(categoryModel);

exports.updateCategory = controllerHandler.update(categoryModel);

exports.deleteCategory = controllerHandler.delete(categoryModel);
