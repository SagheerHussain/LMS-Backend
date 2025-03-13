const Book = require("../modals/bookModal");
const Category = require("../modals/categoryModal");
const Author = require("../modals/authorModal");
const cloudinary = require("../cloudinary");

// ✅ **1. Get All Books**
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('category').populate('author').populate('reviews');
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
    if (!keyword) {
      return res.status(400).json({ message: "Search keyword is required" });
    }

    // Split keywords into array for multi-word search
    const words = keyword.split(" "); // ["mini", "manual"]

    // Generate regex for each word
    const regexQueries = words.map(word => ({
      $or: [
        { title: { $regex: word, $options: "i" } },
        { description: { $regex: word, $options: "i" } }
      ]
    }));

    // Find categories matching the keyword
    const matchingCategories = await Category.find({
      name: { $regex: keyword, $options: "i" }
    });

    // Extract category IDs
    const categoryIds = matchingCategories.map(cat => cat._id);

    // Include category search in query
    const books = await Book.find({
      $or: [
        { $and: regexQueries }, // Match title & description
        { category: { $in: categoryIds } } // Match category
      ]
    })
      .populate("category")
      .populate("author")
      .populate({
        path: "reviews",
        populate: { path: "student" }
      });

    res.status(200).json(books);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ **4. Filter Books by Category**
const getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const isExist = await Category.findOne({ slug: category });
    if (!isExist)
      return res.status(400).json({ message: "Category is not found" });

    const books = await Book.find({ category: isExist._id }).populate('category').populate('author').populate('reviews', { populate: { path: "student" } });

    res.status(200).json({ message: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **5. Filter Books by Author**
const getBooksByAuthor = async (req, res) => {
  try {
    const { author } = req.params;

    const isExist = await Author.findOne({ slug: author });
    if (!isExist)
      return res.status(400).json({ message: "Author is not found" });

    const books = await Book.find({ author: isExist._id }).populate('category').populate('author').populate('reviews', { populate: { path: "student" } });

    res.status(200).json({ message: books });
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
      color,
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
    res.status(201).json({ success: true, message: "Book added successfully", book: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **7. Update a Book by ID**
const updateBook = async (req, res) => {
  try {
    // Pehle database se existing book nikal lo
    const existingBook = await Book.findById(req.params.id);
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Agar naye image file aayi hai, to usko Cloudinary pe upload karo
    let imageUrl = existingBook.image; // Default: Pehli wali image rahegi
    if (req.file) {
      const imgUpload = await cloudinary.uploader.upload(req.file.path);
      imageUrl = imgUpload.url; // Naya image URL save karo
    }

    // Book ko update karo, agar naye fields bheje gaye hain to update ho jayein
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imageUrl }, // Existing image ya new image ko set karo
      { new: true }
    );

    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
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
