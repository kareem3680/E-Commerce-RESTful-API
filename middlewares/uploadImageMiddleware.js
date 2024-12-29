const multer = require("multer");
const APiError = require("../utils/apiError");

const multerOptions = () => {
  // multer Desk Storage
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     const savePath = path.resolve("uploads", "categories");
  //     if (!fs.existsSync(savePath)) {
  //       fs.mkdirSync(savePath, { recursive: true });
  //     }
  //     cb(null, savePath);
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, fileName);
  //   },
  // });

  // multer memory storage
  const multerStorage = multer.memoryStorage();

  // multer Filter
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new APiError("Not an image! Please upload only images.", 400), false);
    }
  };

  // process
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultipleImage = () =>
  multerOptions().fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]);
