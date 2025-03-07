const express = require("express");
const {
  createBorrowRequest,
  updateBorrowRequestStatus,
  getAllBorrowedBooks,
  getBorrowedBooks,
  getBorrowedRequest,
  getBorrowedHistory
} = require("../controllers/borrowedController");

const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// ✅ Borrowed Books & Requests
router.post("/", createBorrowRequest);
router.put("/update/:id", updateBorrowRequestStatus);
router.get("/", getAllBorrowedBooks);
router.get("/borrowed-books/:studentId", authenticateToken, getBorrowedBooks);
router.get("/borrowed-requests/:studentId", authenticateToken, getBorrowedRequest);
router.get("/borrow-history/:studentId", authenticateToken, getBorrowedHistory);

module.exports = router;