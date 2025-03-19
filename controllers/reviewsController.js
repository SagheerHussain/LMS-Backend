const Review = require("../modals/reviewsModal");
const Book = require("../modals/bookModal");

// Get Reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reviews By Book
const getReviewByBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const reviews = await Review.find({ book: book._id })
      .populate("book")
      .populate("student");
    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Approved Review
const getApprovedReviews = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const reviews = await Review.find({ book: book._id, status: "Approved" })
      .populate("book")
      .populate("student");
    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    res.status(200).json({
      success: true,
      message: "Review created successfully",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create Review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });

    const updateReview = await Review.findByIdAndUpdate(
      { _id: id },
      { status },
      {
        new: true,
      }
    );

    if (!updateReview)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Review updated successfully",
        review: updateReview,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteReview = await Review.findByIdAndDelete({ _id: id });

    if (!deleteReview)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getReviews,
  getReviewByBook,
  getApprovedReviews,
  createReview,
  updateReview,
  deleteReview,
};
