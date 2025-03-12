const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    universityId: { type: String, required: true, unique: true },
    universityIdCardImage: { type: String, required: true }, // ✅ University ID Card Image
    profilePicture: { type: String, required: true }, // ✅ Profile Picture
    universityName: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // Admin verification
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "BorrowedBook" }],
    borrowedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "BorrowRequest" }],
    borrowedHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "BorrowedHistory" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
