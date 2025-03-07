const express = require("express");

const {
  getAuthors,
  getAuthorById,
  addAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

const router = express.Router();

// Get All Authors
router.get("/", getAuthors);

// Get Single Author
router.get("/:id", getAuthorById);

// Create Author
router.post("/", addAuthor);

// Update Author
router.put("/update/:id", updateAuthor);

// Delete Author
router.delete("/delete/:id", deleteAuthor);

module.exports = router;
