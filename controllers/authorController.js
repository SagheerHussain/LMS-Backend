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
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id, req.body, { new: true });
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAuthors,
  getAuthorById,
  addAuthor,
  updateAuthor,
  deleteAuthor,
};
