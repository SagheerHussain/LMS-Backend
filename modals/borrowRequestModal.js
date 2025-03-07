const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BorrowRequest", borrowRequestSchema);
