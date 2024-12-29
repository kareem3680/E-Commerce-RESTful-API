//
const path = require("path");
//
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
//
const dbConnection = require("./config/dataBase");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const globalError = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/apiError");

// Express
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// DB Connection
dotenv.config({ path: "config.env" });
dbConnection();

// Module
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/sub-categories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

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
