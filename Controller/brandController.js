const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const controllerHandler = require("./controllerHandler");
const uploadImage = require("../middlewares/uploadImageMiddleware");
const brandModel = require("../models/brandModel");

exports.uploadBrandImage = uploadImage.uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    const savePath = path.resolve("uploads", "brands");
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

exports.createBrand = controllerHandler.create(brandModel);

exports.getSpecificBrand = controllerHandler.getSpecific(brandModel);

exports.getBrands = controllerHandler.getAll(brandModel);

exports.updateBrand = controllerHandler.update(brandModel);

exports.deleteBrand = controllerHandler.delete(brandModel);
