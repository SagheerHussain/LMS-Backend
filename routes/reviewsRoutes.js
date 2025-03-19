const express = require("express");

const { createReview, updateReview, approveReview, getReviewByBook, deleteReview } = require("../controllers/reviewsController");

const router = express.Router();

const { authenticateToken } = require("../middleware/auth");

router.get("/review/:id", authenticateToken, getReviewByBook);

router.post("/", authenticateToken, createReview);

router.post("/approve/:id", authenticateToken, approveReview);

router.put("/update/:id", updateReview);

router.delete("/delete/:id", deleteReview);

module.exports = router;
