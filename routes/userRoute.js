const express = require("express");
const userController = require("../Controller/userController");

const router = express.Router();
const userValidator = require("../utils/validators/userValidator");
const authController = require("../Controller/authController");

router.get(
  "/getMyData",
  authController.protect,
  userController.getMyData,
  userValidator.getUserValidator
);

router.put(
  "/updateMyData",
  authController.protect,
  userController.updateMyData,
  userValidator.updateUserValidator,
  userController.resizeImage
);

router.put(
  "/updateMyPassword",
  authController.protect,
  userValidator.changePasswordValidator,
  userController.updateMyPassword
);

router.delete(
  "/deactivateMyUser",
  authController.protect,
  userController.deactivateMyUser
);

module.exports = router;
