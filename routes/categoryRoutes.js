const express = require("express");

const {
    getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
    deleteManyCategories
  } = require("../controllers/categoryController");

const router = express.Router();

// Get All Categories
router.get("/", getCategories);

// Get Single Category
router.get("/category/:id", getCategoryById);

// Create Category
router.post("/", addCategory);

// Update Category
router.put("/update/:id", updateCategory);  

// Delete Category
router.delete("/delete/:id", deleteCategory);

// Delete Many Categories
router.delete("/delete-many", deleteManyCategories);

module.exports = router