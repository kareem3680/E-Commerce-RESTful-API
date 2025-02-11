const express = require("express");

const router = express.Router();

const settingController = require("../Controller/settingController");
const authController = require("../Controller/authController");

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    settingController.getSettings
  )
  .post(
    authController.protect,
    authController.allowedTo("owner"),
    settingController.addSetting
  );

router
  .route("/:id")
  .put(
    authController.protect,
    authController.allowedTo("owner"),
    settingController.updateSetting
  );

module.exports = router;
