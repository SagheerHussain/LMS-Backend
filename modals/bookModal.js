const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Image URL
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    ISBN: { type: Number, required: true, default: 0 },
    Binding: { type: String, default: 0 },
    totalPages: { type: Number, required: true, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    totalCopies: { type: Number, required: true },
    availableCopies: { type: Number, required: true },
    color: { type: String }, // Optional, if books have color codes
    summary: { type: String },
    publishedYear: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
