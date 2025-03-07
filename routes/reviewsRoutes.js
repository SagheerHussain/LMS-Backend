const express = require("express");

const { createReview, updateReview, getReviews, deleteReview } = require("../controllers/reviewsController");

const router = express.Router();

const { authenticateToken } = require("../middleware/auth");

router.get("/", getReviews);

router.post("/", authenticateToken,  createReview);

router.put("/update/:id", updateReview);

router.delete("/delete/:id", deleteReview);

module.exports = router;
