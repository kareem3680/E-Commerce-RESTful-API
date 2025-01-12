const express = require("express");
const authController = require("../Controller/authController");

const router = express.Router();
const authValidator = require("../utils/validators/authValidator");

router.post("/signUp", authValidator.signUpValidator, authController.signUp);

router.post("/logIn", authValidator.logInValidator, authController.logIn);

module.exports = router;
