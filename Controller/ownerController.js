const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const path = require("path");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utils/apiError");
const controllerHandler = require("./controllerHandler");
const uploadImage = require("../middlewares/uploadImageMiddleware");
const userModel = require("../models/userModel");

exports.uploadUserImage = uploadImage.uploadSingleImage("profileImage");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    const savePath = path.resolve("uploads", "users");
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(path.resolve(savePath, filename));
    //save image into database
    req.body.profileImage = filename;
  }
  next();
});

exports.createUser = controllerHandler.create(userModel);

exports.getSpecificUser = controllerHandler.getSpecific(userModel);

exports.getUsers = controllerHandler.getAll(userModel);

exports.updateUser = controllerHandler.update(userModel);

exports.deleteUser = controllerHandler.delete(userModel);

exports.changePasswordHandler = asyncHandler(async (req, res, next) => {
  const { newPassword, email } = req.body;
  const document = await userModel.findOneAndUpdate(
    { email },
    {
      password: await bcrypt.hash(newPassword, 8),
      changedPasswordAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No user found for this email: ${email}`, 404));
  }
  res.status(200).json({ data: document });
});
