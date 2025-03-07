const Student = require("../modals/studentModal");

const getStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password"); // Password hide karne ke liye
    if (students.length < 0) return res.status(404).json({ message: "Students not found" });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).select("-password"); // Password hide karne ke liye
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updatedData = req.body;

    const student = await Student.findByIdAndUpdate(studentId, updatedData, {
      new: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ message: "Profile updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteStudentAccount = async (req, res) => {
  try {
    const { studentId } = req.params;
    await Student.findByIdAndDelete(studentId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  getStudents,
  getStudentDetails,
  updateStudentProfile,
  deleteStudentAccount,
};
