const express = require("express");
const router = express.Router();
const faqController = require("../controllers/FaqController");
const authenticatedToken = require("../middlewares/authMiddleware");

router.post("/new-faq", faqController.createFaq);
router.get("/", authenticatedToken, faqController.getAllFaqs);
router.get("/active", authenticatedToken, faqController.getActiveFaqs);
router.get("/:id", authenticatedToken, faqController.getFaqById);
router.put("/edit/:id", faqController.updateFaq);
router.delete("/remove/:id", authenticatedToken, faqController.deleteFaq);

module.exports = router;
