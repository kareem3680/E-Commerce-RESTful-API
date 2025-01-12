const express = require("express");
const forgetPasswordController = require("../Controller/forgetPasswordController");

const router = express.Router();
const forgetPasswordValidator = require("../utils/validators/forgetPasswordValidator");

router.post(
  "/sendResetCode",
  forgetPasswordValidator.forgetPasswordValidator,
  forgetPasswordController.forgetPassword
);

router.post(
  "/verifyResetCode",
  forgetPasswordValidator.verifyResetCodeValidator,
  forgetPasswordController.verifyResetCode
);

router.put(
  "/resetPassword",
  forgetPasswordValidator.resetPasswordValidator,
  forgetPasswordController.resetPassword
);

module.exports = router;
