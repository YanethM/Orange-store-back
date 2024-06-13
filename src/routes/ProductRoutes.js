const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/products");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/new-product', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'background', maxCount: 1 }
]), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.patch(
  "/edit/:id",
  upload.array("images"),
  productController.updateProduct
);
router.delete("/remove/:id", productController.deleteProduct);

module.exports = router;
