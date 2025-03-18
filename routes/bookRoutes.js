const express = require("express");
const upload = require("../upload");

const {
  getAllBooks,
  getBooksLength,
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

// Get Total Books Length
router.get("/length", getBooksLength);

// Get Single Book
router.get("/book/:id", getBookById);

// Get Books By Search Results
router.get("/search", searchBooks);

// Get Books By Category
router.get("/category/:category", getBooksByCategory);

// Get Books By Author
router.get("/author/:author", getBooksByAuthor);

// Create Book
router.post("/", upload.single("image"),  addBook);

// Update Book
router.put("/update/:id", upload.single("image"), updateBook);

// Delete Book
router.delete("/delete/:id", deleteBook);

module.exports = router;
