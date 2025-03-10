const Review = require("../modals/reviewsModal");
const Book = require("../modals/bookModal");

// Get Reviews
const getReviewByBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const reviews = await Review.find({ book: book._id }).populate("book").populate("student");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create Review
const createReview = async (req, res) => {
  try {
    const { student, book, rating, review } = req.body;

    const newReview = await Review.create({
      book,
      student,
      rating,
      review,
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json(error);
  }
};

// create Review
const updateReview = async (req, res) => {
  try {
    const updateReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updateReview) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review updated successfully", review: updateReview });

  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const deleteReview = await Review.findByIdAndDelete(req.params.id);

    if (!deleteReview) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review deleted successfully" });

  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getReviewByBook,
  createReview,
  updateReview,
  deleteReview
};
