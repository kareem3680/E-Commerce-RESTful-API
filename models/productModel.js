const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "product title is required"],
      trim: true,
      minlength: [3, "Too short product name"],
      maxlength: [100, "Too long product name"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minlength: [10, "Too short product description"],
      maxlength: [500, "Too long product description"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      trim: true,
      max: [250000, "Too long product Price"],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
      max: [200000, "Too long product Price after discount"],
      validate: {
        validator: function (value) {
          return value <= this.originalPrice;
        },
        message:
          "Price after sale must be less than or equal to the original price",
      },
    },
    colors: {
      type: [String],
    },
    imageCover: {
      type: String,
      required: [true, "Image cover image is required"],
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to main category"],
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "subCategory",
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "rating must be above or equal 1"],
      max: [5, "rating must be below or equal 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
