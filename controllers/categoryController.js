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

const deleteManyCategories = async (req, res) => {
  try {
    const ids = req.query.ids.split(","); // Convert query string to array
    console.log(ids);
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    await Category.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Categories deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting categories:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
  deleteManyCategories,
};
