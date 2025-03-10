const BorrowedHistory = require("../modals/borrowedHistoryModal");
const BorrowedBook = require("../modals/borrowedBookModal");
const BorrowedRequest = require("../modals/borrowRequestModal");
const Student = require("../modals/studentModal");

// ✅ Get Borrowed Books
const getAllBorrowedBooks = async (req, res) => {
  try {
    const books = await BorrowedBook.find()
      .populate("book")
      .populate("student");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Borrowed Requests
const getAllBorrowedRequests = async (req, res) => {
  try {
    const books = await BorrowedRequest.find()
      .populate("book")
      .populate("student");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Borrowed History
const getAllBorrowedHistory = async (req, res) => {
  try {
    const books = await BorrowedHistory.find()
      .populate("book")
      .populate("student");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Create Request
const createBorrowRequest = async (req, res) => {
  try {
    const { studentId, bookId } = req.body;
    console.log(req.body);
    const student = await Student.findById({ _id: studentId });
    console.log(student);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.isVerified)
      return res.status(403).json({ message: "Student is not verified" });

    const createRequest = await BorrowedRequest.create({
      student: studentId,
      book: bookId,
    });
    res.status(200).json({
      message: "Borrow request created successfully",
      data: createRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Borrow Request Status
const updateBorrowRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the borrow request
    const borrowRequest = await BorrowedRequest.findById({ _id: id })
      .populate("student")
      .populate("book");
    if (!borrowRequest) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    // If Approved: Move request to BorrowedBook and delete from BorrowedRequest
    if (status === "Approved") {
      const borrowedDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(borrowedDate.getDate() + 5); // Due after 5 days

      await BorrowedBook.create({
        student: borrowRequest.student._id,
        book: borrowRequest.book._id,
        borrowedDate,
        dueDate,
      });

      // Delete the request from BorrowedRequest
      await BorrowedRequest.findByIdAndDelete({ _id: id });

      return res.status(200).json({
        message: "Borrow request approved and moved to borrowed books",
      });
    }

    // If Rejected: Move request to BorrowedHistory and delete from BorrowedRequest
    if (status === "Rejected") {
      await BorrowedHistory.create({
        student: borrowRequest.student._id,
        book: borrowRequest.book._id,
        borrowedDate: borrowRequest.requestDate,
        dueDate: borrowRequest.requestDate, // Same as request date
      });

      // Delete the request from BorrowedRequest
      await BorrowedRequest.findByIdAndDelete({ _id: id });

      return res
        .status(200)
        .json({ message: "Borrow request rejected and moved to history" });
    }

    // Invalid status
    return res
      .status(400)
      .json({ message: "Invalid status. Use 'Approved' or 'Rejected'." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Borrowed Books
const getBorrowedBooks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate(
      "borrowedBooks.book"
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student.borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Borrowed Requests
const getBorrowedRequest = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate(
      "borrowRequests.book"
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student.borrowRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Move Expired Borrowed Books to History
const moveExpiredBooksToHistory = async () => {
  try {
    const expiredBooks = await BorrowedBook.find({
      dueDate: { $lt: new Date() },
    });
    for (let book of expiredBooks) {
      await BorrowedHistory.create({
        student: book.student,
        book: book.book,
        borrowedDate: book.borrowedDate,
        dueDate: book.dueDate,
      });
      await BorrowedBook.findByIdAndDelete(book._id);
    }
    console.log("Expired borrowed books moved to history.");
  } catch (error) {
    console.error("Error moving books to history:", error);
  }
};

// Run the function periodically (every 24 hours)
setInterval(moveExpiredBooksToHistory, 24 * 60 * 60 * 1000);

// ✅ Get Borrowed History
const getBorrowedHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const history = await BorrowedHistory.find({ student: studentId }).populate(
      "book"
    );
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createBorrowRequest,
  updateBorrowRequestStatus,
  getAllBorrowedBooks,
  getAllBorrowedRequests,
  getAllBorrowedHistory,
  getBorrowedBooks,
  getBorrowedRequest,
  getBorrowedHistory,
};
