const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    universityId: { type: String, required: true, unique: true },
    image: { type: String, required: true }, // URL for the image
    universityName: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // Admin verification
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "BorrowedBook" }],
    borrowRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "BorrowRequest" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
