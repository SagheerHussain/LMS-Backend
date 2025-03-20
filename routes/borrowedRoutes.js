const express = require("express");
const {
  createBorrowRequest,
  updateBorrowRequestStatus,
  getAllBorrowedBooks,
  getBorrowedRequestLength,
  getAllBorrowedRequests,
  getAllBorrowedHistory,
  getBorrowedBooks,
  getBorrowedRequest,
  getBorrowedHistory,
  moveExpiredBooksToHistory,
  deleteBorrowedBook,
  deleteBorrowedRequest,
  deleteBorrowedHistory,
  deleteManyBorrowedRequests
} = require("../controllers/borrowedController");

const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// ✅ Borrowed Books & Requests
router.post("/", authenticateToken, createBorrowRequest);
router.put("/update/:id", authenticateToken, updateBorrowRequestStatus);
router.get("/borrowed-books", authenticateToken, getAllBorrowedBooks);
router.get("/borrowed-requests-length", getBorrowedRequestLength);
router.get("/move-expired/:id", authenticateToken, moveExpiredBooksToHistory);
router.get("/borrowed-requests", authenticateToken, getAllBorrowedRequests);
router.get("/borrowed-history", authenticateToken, getAllBorrowedHistory);
router.get("/borrowed-books/:id", authenticateToken, getBorrowedBooks);
router.get("/borrowed-requests/:id", authenticateToken, getBorrowedRequest);
router.get("/borrowed-history/:id", authenticateToken, getBorrowedHistory);
router.delete("/borrowed-books/delete/:id", authenticateToken, deleteBorrowedBook);
router.delete("/borrowed-requests/delete/:id", authenticateToken, deleteBorrowedRequest);
router.delete("/borrowed-history/delete/:id", authenticateToken, deleteBorrowedHistory);
router.delete("/borrowed-requests/delete-many", authenticateToken, deleteManyBorrowedRequests);

module.exports = router;