// Import required libraries
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const hpp = require("hpp");

// Import files
const dbConnection = require("./config/dataBase");
const mountRoutes = require("./routes");
const globalError = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/apiError");
const controller = require("./Controller/orderController");

// Application
const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.options("*", cors());

//WebHook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  controller.webhookCheckout
);

// usage
app.use(compression());
app.use(express.json({ limit: "50 kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

// DB Connection
dotenv.config({ path: "config.env" });
dbConnection();

// Module
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Security
app.use(mongoSanitize());
app.use([body("*").trim().escape()]);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again after 15 minutes.",
});
app.use("/api", limiter);
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// Routes
mountRoutes(app);
app.all("*", (req, res, next) => {
  next(new ApiError(`can not find this route : ${req.originalUrl}`, 400));
});

// Handle Errors In Express
app.use(globalError);

// Server
const PORT = process.env.PORT || 8000;
const MODE = process.env.NODE_ENV;
const server = app.listen(PORT, () => {
  console.log(`Mode Is: ${MODE}\nServer is running on port: ${PORT}`);
});

// Handle Rejections Out Side Express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`shutting down ....`);
    process.exit(1);
  });
});
