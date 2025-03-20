const Author = require("../modals/authorModal");

const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const addAuthor = async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.status(200).json({ success: true, message: "Author added successfully", author: author });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Author updated successfully", author: author });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Author deleted successfully", author: author });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteManyAuthors = async (req, res) => {
  try {
    const ids = req.query.ids.split(","); // Convert query string to array
    console.log(ids);
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    await Author.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Authors deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting authors:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = {
  getAuthors,
  getAuthorById,
  addAuthor,
  updateAuthor,
  deleteAuthor,
  deleteManyAuthors,
};
