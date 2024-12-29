const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [30, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const SetImageURL = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageURL;
  }
};
categorySchema.post("init", (doc) => {
  SetImageURL(doc);
});
categorySchema.post("save", (doc) => {
  SetImageURL(doc);
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
