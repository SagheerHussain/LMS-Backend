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
      success: true,
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
        success: true,
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

      return res.status(200).json({
        success: true,
        message: "Borrow request rejected and moved to history",
      });
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
    const { id } = req.params;
    const student = await Student.findById({ _id: id }).populate(
      "borrowedBooks"
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    const borrowedBooks = await BorrowedBook.find({ student: id }).populate(
      "book"
    );

    res.status(200).json({ data: borrowedBooks, message: "Borrowed Books" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Borrowed Requests
const getBorrowedRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById({ _id: id }).populate(
      "borrowedRequests"
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    const borrowedRequests = await BorrowedRequest.find({
      student: id,
    }).populate("book");

    res
      .status(200)
      .json({ data: borrowedRequests, message: "Borrowed Requests" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Length of Borrowed Request
const getBorrowedRequestLength = async (req, res) => {
  try {
    const borrowedRequests = await BorrowedRequest.countDocuments();
    res.status(200).json({ totalBorrowedRequests: borrowedRequests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Move Expired Borrowed Books to History
const moveExpiredBooksToHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Check if student exists
    const student = await Student.findById({ _id: id });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Step 2: Find all borrowed books of the student
    const borrowedBooks = await BorrowedBook.find({ student: id });

    let movedCount = 0; // To count how many books moved to history

    for (let book of borrowedBooks) {
      // Step 3: Check if due date has expired
      if (book.dueDate < new Date()) {
        // Step 4: Move to BorrowedHistory
        await BorrowedHistory.create({
          student: book.student,
          book: book.book,
          borrowedDate: book.borrowedDate,
          dueDate: book.dueDate,
        });

        // Step 5: Remove from BorrowedBook
        await BorrowedBook.findByIdAndDelete(book._id);
        movedCount++;
      }
    }

    if (movedCount > 0) {
      return res.status(200).json({
        success: true,
        message: `${movedCount} expired books moved to history.`,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No expired books found for this student.",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

// ✅ Get Borrowed History
const getBorrowedHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById({ _id: id }).populate(
      "borrowedHistory"
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    const borrowedHistory = await BorrowedHistory.find({
      student: id,
    }).populate("book");

    res
      .status(200)
      .json({ data: borrowedHistory, message: "Borrowed History" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Borrowed Books
const deleteBorrowedBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await BorrowedBook.findByIdAndDelete(id);
    res.status(200).json({
      message: "Borrowed book deleted successfully",
      data: deletedBook,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Borrowed Requests
const deleteBorrowedRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await BorrowedRequest.findByIdAndDelete(id);
    res.status(200).json({
      message: "Borrowed request deleted successfully",
      data: deletedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Borrowed History
const deleteBorrowedHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHistory = await BorrowedHistory.findByIdAndDelete(id);
    res.status(200).json({
      message: "Borrowed history deleted successfully",
      data: deletedHistory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Many Borrowed Requests by IDs
const deleteManyBorrowedRequests = async (req, res) => {
  try {
    const ids = req.query.ids.split(","); // Convert query string to array
    console.log(ids);
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    await BorrowedRequest.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Borrowed requests deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting borrowed requests:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = {
  createBorrowRequest,
  updateBorrowRequestStatus,
  getBorrowedRequestLength,
  moveExpiredBooksToHistory,
  getAllBorrowedBooks,
  getAllBorrowedRequests,
  getAllBorrowedHistory,
  getBorrowedBooks,
  getBorrowedRequest,
  getBorrowedHistory,
  deleteBorrowedBook,
  deleteBorrowedRequest,
  deleteBorrowedHistory,
  deleteManyBorrowedRequests,
};
