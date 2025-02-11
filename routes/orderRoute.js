const express = require("express");
const orderController = require("../Controller/orderController");

const router = express.Router();
const authController = require("../Controller/authController");

router
  .route("/")
  .get(
    authController.protect,
    orderController.filterOrderForUsers,
    orderController.getAllOrders
  );
router
  .route("/:id")
  .post(
    authController.protect,
    authController.allowedTo("user"),
    orderController.createCashOrder
  );
router
  .route("/checkout-session/:id")
  .get(
    authController.protect,
    authController.allowedTo("user"),
    orderController.checkOutSession
  );

router
  .route("/:id")
  .put(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    orderController.updateOrderStatus
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.allowedTo("owner"),
    orderController.deleteOrder
  );

module.exports = router;
