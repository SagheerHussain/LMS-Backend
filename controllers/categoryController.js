const Category = require("../modals/categoryModal");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categories = await Category.findById(req.params.id);
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const addCategory = await Category.create(req.body);
    res.status(200).json({ success: true, message: "Category added successfully", category: addCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Category updated successfully", update: updateCategory, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categories = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
