const express = require("express");

const { getReviews, getApprovedReviews, createReview, updateReview, getReviewByBook, deleteReview } = require("../controllers/reviewsController");

const router = express.Router();

const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, getReviews);

router.get("/review/:id", authenticateToken, getReviewByBook);

router.get("/approved/review/:id", authenticateToken, getApprovedReviews);

router.post("/", authenticateToken, createReview);

router.put("/update/:id", updateReview);

router.delete("/delete/:id", deleteReview);

module.exports = router;
