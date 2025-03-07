const express = require("express");
const upload = require("../upload");

const {
  getAllBooks,
  getBookById,
  searchBooks,
  getBooksByCategory,
  getBooksByAuthor,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const router = express.Router();

// Get All Books
router.get("/", getAllBooks);

// Get Single Book
router.get("/:id", getBookById);

// Get Books By Search Results
router.get("/search", searchBooks);

// Get Books By Category
router.get("/category", getBooksByCategory);

// Get Books By Author
router.get("/author", getBooksByAuthor);

// Create Book
router.post("/", upload.single("image"),  addBook);

// Update Book
router.put("/:id", updateBook);

// Delete Book
router.delete("/:id", deleteBook);

module.exports = router;
