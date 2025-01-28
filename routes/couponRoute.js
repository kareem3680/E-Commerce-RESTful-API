const express = require("express");

const router = express.Router();

const couponController = require("../Controller/couponController");
const couponValidator = require("../utils/validators/couponValidator");
const authController = require("../Controller/authController");

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    couponController.getCoupons
  )
  .post(
    authController.protect,
    authController.allowedTo("owner"),
    couponValidator.createCouponValidator,
    couponController.createCoupon
  );

router
  .route("/:id")
  .get(couponValidator.getCouponValidator, couponController.getSpecificCoupon)
  .put(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    couponValidator.updateCouponValidator,
    couponController.updateCoupon
  )
  .delete(
    authController.protect,
    authController.allowedTo("owner"),
    couponValidator.deleteCouponValidator,
    couponController.deleteCoupon
  );

module.exports = router;
