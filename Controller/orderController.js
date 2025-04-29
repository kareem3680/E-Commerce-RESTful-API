/* eslint-disable no-undef */
/* eslint-disable no-case-declarations */
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ApiError = require("../utils/apiError");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const settingController = require("./settingController");
const controllerHandler = require("./controllerHandler");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxes = await settingController.useSettings("taxes");
  const shipping = await settingController.useSettings("shipping");

  const cart = await cartModel.findById(req.params.id);
  if (!cart) {
    return next(new ApiError("No cart found for this user", 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + (cartPrice * taxes) / 100 + shipping;
  const order = await orderModel.create({
    customer: req.user._id,
    items: cart.cartItems,
    cartPrice: cartPrice,
    taxes: (cartPrice * taxes) / 100,
    shipping: shipping,
    totalOrderPrice: totalOrderPrice,
    status: "pending",
  });
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    await cartModel.findByIdAndDelete(req.params.id);
  }
  res.status(201).json({ message: "Order complete", data: order });
});

const createCreditOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.customer_details.address;
  const orderPrice = session.amount_total / 100;
  const cart = await cartModel.findById(cartId);
  const user = await userModel.findOne({ email: session.customer_email });
  const taxes = await settingController.useSettings("taxes");
  const shipping = await settingController.useSettings("shipping");
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const order = await orderModel.create({
    customer: user._id,
    shippingAddress,
    items: cart.cartItems,
    cartPrice: cartPrice,
    taxes: (cartPrice * taxes) / 100,
    shipping: shipping,
    totalOrderPrice: orderPrice,
    status: "Approved",
    paymentMethod: "online payment",
    isPaid: true,
    paidAt: Date.now(),
  });
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    await cartModel.findByIdAndDelete(cartId);
  }
};

exports.checkOutSession = asyncHandler(async (req, res, next) => {
  const taxes = await settingController.useSettings("taxes");
  const shipping = await settingController.useSettings("shipping");
  const cart = await cartModel.findById(req.params.id);
  if (!cart) {
    return next(new ApiError("No cart found for this user", 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + (cartPrice * taxes) / 100 + shipping;
  const address = (req.user.addresses && req.user.addresses[0]) || {};
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: Math.round(totalOrderPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/carts`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: {
      phone: address.phone || "N/A",
      details: address.details || "N/A",
      country: address.country || "N/A",
      city: address.city || "N/A",
      postalCode: address.postalCode || "N/A",
    },
  });
  res.status(200).json({ message: "success", data: session });
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  let event = req.body;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
  if (endpointSecret) {
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      await createCreditOrder(session);
      console.log(
        `PaymentIntent for ${session.amount_total / 100} was successful!`
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  res.send();
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("No order found with this ID", 404));
  }
  if (req.body.isPaid) {
    order.isPaid = true;
    order.paidAt = Date.now();
  }
  if (req.body.status == "delivered") {
    order.status = "delivered";
    order.deliveredAt = Date.now();
  }
  order.status = req.body.status;
  await order.save();
  res.json({ message: "Order updated successfully", data: order });
});

exports.filterOrderForUsers = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") req.filterObject = { customer: req.user._id };
  next();
});

exports.getAllOrders = controllerHandler.getAll(orderModel);

exports.deleteOrder = controllerHandler.delete(orderModel);
