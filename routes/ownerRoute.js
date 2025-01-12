const express = require("express");
const ownerController = require("../Controller/ownerController");

const router = express.Router();
const ownerValidator = require("../utils/validators/ownerValidator");
const authController = require("../Controller/authController");

router.put(
  "/changePassword",
  authController.protect,
  authController.allowedTo("owner"),
  ownerValidator.changePasswordValidator,
  ownerController.changePasswordHandler
);

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("owner"),
    ownerController.getUsers
  )
  .post(
    authController.protect,
    authController.allowedTo("owner"),
    ownerValidator.createUserValidator,
    ownerController.resizeImage,
    ownerController.createUser
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.allowedTo("owner"),
    ownerValidator.getUserValidator,
    ownerController.getSpecificUser
  )
  .put(
    authController.protect,
    authController.allowedTo("owner"),
    ownerValidator.updateUserValidator,
    ownerController.resizeImage,
    ownerController.updateUser
  )
  .delete(
    authController.protect,
    authController.allowedTo("owner"),
    ownerValidator.deleteUserValidator,
    ownerController.deleteUser
  );
module.exports = router;
