const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowedDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true }, // Auto set to borrowedDate + 5 days
}, { timestamps: true });

module.exports = mongoose.model("BorrowedBook", borrowedBookSchema);