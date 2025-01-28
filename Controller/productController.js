const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const controllerHandler = require("./controllerHandler");
const productModel = require("../models/productModel");
const uploadImages = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadImages.uploadMultipleImage();

exports.resizeImage = asyncHandler(async (req, res, next) => {
  // ImageCover
  if (req.files) {
    if (req.files.imageCover) {
      const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-Cover.jpeg`;
      const savePath = path.resolve("uploads", "products");
      if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath, { recursive: true });
      }
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1330)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(path.resolve(savePath, imageCoverFilename));
      //save image into database
      req.body.imageCover = imageCoverFilename;
    } else if (req.files.image) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(
          asyncHandler(async (image, index) => {
            const imagesFilename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
            const savePath = path.resolve("uploads", "products");
            if (!fs.existsSync(savePath)) {
              fs.mkdirSync(savePath, { recursive: true });
            }
            await sharp(image.buffer)
              .resize(1024, 800)
              .toFormat("jpeg")
              .jpeg({ quality: 95 })
              .toFile(path.resolve(savePath, imagesFilename));
            //save image into database
            req.body.images.push(imagesFilename);
          })
        )
      );
    }
  }
  next();
});

exports.createProduct = controllerHandler.create(productModel);

exports.getSpecificProduct = controllerHandler.getSpecific(productModel);

exports.getProducts = controllerHandler.getAll(productModel, "product");

exports.updateProduct = controllerHandler.update(productModel);

exports.deleteProduct = controllerHandler.delete(productModel);
