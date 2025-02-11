const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const couponRoute = require("./couponRoute");
const reviewRoute = require("./reviewRoute");
const wishlistRoute = require("./wishlistRoute");
const addressRoute = require("./addressRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");
const ownerRoute = require("./ownerRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const forgetPasswordRoute = require("./forgetPasswordRoute");
const settingRoute = require("./settingRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/sub-categories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlists", wishlistRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/carts", cartRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/owner", ownerRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/forgetPassword", forgetPasswordRoute);
  app.use("/api/v1/setting", settingRoute);
};

module.exports = mountRoutes;
