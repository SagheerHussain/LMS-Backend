const express = require("express");
const {
  createBorrowRequest,
  updateBorrowRequestStatus,
  getAllBorrowedBooks,
  getAllBorrowedRequests,
  getAllBorrowedHistory,
  getBorrowedBooks,
  getBorrowedRequest,
  getBorrowedHistory
} = require("../controllers/borrowedController");

const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// ✅ Borrowed Books & Requests
router.post("/", authenticateToken, createBorrowRequest);
router.put("/update/:id", authenticateToken, updateBorrowRequestStatus);
router.get("/borrowed-books", authenticateToken, getAllBorrowedBooks);
router.get("/borrowed-requests", authenticateToken, getAllBorrowedRequests);
router.get("/borrowed-history", authenticateToken, getAllBorrowedHistory);
router.get("/borrowed-books/:id", authenticateToken, getBorrowedBooks);
router.get("/borrowed-requests/:id", authenticateToken, getBorrowedRequest);
router.get("/borrowed-history/:id", authenticateToken, getBorrowedHistory);

module.exports = router;