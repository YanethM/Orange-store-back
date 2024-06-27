const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const authenticatedToken = require("../middlewares/authMiddleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/new-product",
  authenticatedToken,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "background", maxCount: 1 },
  ]),
  productController.createProduct
);
router.get("/", productController.getAllProducts);
router.get("/gender-size", productController.getProductsByGenderAndSize);
router.get("/:id", productController.getProductById);
router.patch(
  "/edit/:id",
  authenticatedToken,
  upload.array("images"),
  productController.updateProduct
);
router.delete(
  "/remove/:id",
  authenticatedToken,
  productController.deleteProduct
);

router.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '../../uploads/products', imageName);
  res.sendFile(imagePath);
});


module.exports = router;
