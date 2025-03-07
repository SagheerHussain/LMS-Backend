const Book = require("../modals/bookModal");
const cloudinary = require("../cloudinary")

// ✅ **1. Get All Books**
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **2. Get Single Book by ID**
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("author")
      .populate("category")
      .populate({
        path: "reviews",
        populate: { path: "student" },
      });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **3. Search Books by Title or Description**
const searchBooks = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword)
      return res.status(400).json({ message: "Search keyword is required" });

    const books = await Book.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **4. Filter Books by Category**
const getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category)
      return res.status(400).json({ message: "Category is required" });

    const books = await Book.find({ category });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **5. Filter Books by Author**
const getBooksByAuthor = async (req, res) => {
  try {
    const { author } = req.query;
    if (!author)
      return res.status(400).json({ message: "Author name is required" });

    const books = await Book.find({ author });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **6. Add a New Book**
const addBook = async (req, res) => {
  try {
    const {
      title,
      description,
      rating,
      ISBN,
      binding,
      totalPages,
      author,
      totalCopies,
      availableCopies,
      summary,
      publishedYear,
      category,
      color
    } = req.body;

    const imgPath = await cloudinary.uploader.upload(req.file.path);
    const book = await Book.create({
      title,
      description,
      rating,
      ISBN,
      binding,
      totalPages,
      author,
      totalCopies,
      availableCopies,
      summary,
      publishedYear,
      category,
      color,
      image: imgPath.url,
    });
    res.status(201).json({ message: "Book added successfully", book: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **7. Update a Book by ID**
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook)
      return res.status(404).json({ message: "Book not found" });

    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **8. Delete a Book by ID**
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook)
      return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  searchBooks,
  getBooksByCategory,
  getBooksByAuthor,
  addBook,
  updateBook,
  deleteBook,
};
