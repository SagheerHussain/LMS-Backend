const Student = require("../modals/studentModal");
const cloudinary = require("../cloudinary");

const getStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password"); // Password hide karne ke liye
    if (students.length < 0)
      return res.status(404).json({ message: "Students not found" });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getStudentsLength = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments(); // It counts total number of documents
    res.status(200).json({ totalStudents: totalStudents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getUnverifiedStudentsLength = async (req, res) => {
  try {
    const unverifiedStudents = await Student.countDocuments({ isVerified: false });
    res.status(200).json({ totalUnverifiedStudents: unverifiedStudents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).select("-password"); // Password hide karne ke liye
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAccountRequests = async (req, res) => {
  try {
    const students = await Student.find({ isVerified: false }).select(
      "-password"
    );
    if (students.length < 0)
      return res.status(404).json({ message: "Students not found" });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateAccountRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      { _id: id },
      { isVerified: status },
      { new: true }
    );

    if (!updatedStudent)
      return res
        .status(404)
        .json({ message: "Student not Updated", success: false });

    res.status(200).json({
      message: "Account request status updated successfully",
      success: true,
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success: false });
  }
}

const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, universityId, universityName } = req.body;

    const isExist = await Student.findById({ _id: id });
    if (!isExist) return res.status(404).json({ message: "Student not found" });

    let universityIdCardImagePath = req.body.universityIdCardImage;
    let profilePicturePath = req.body.profilePicture;

    if (req.files["universityIdCardImage"]) {
      const imgUpload = await cloudinary.uploader.upload(
        req.files["universityIdCardImage"][0].path
      );
      universityIdCardImagePath = imgUpload.url;
    }

    if (req.files["profilePicture"]) {
      const imgUpload = await cloudinary.uploader.upload(
        req.files["profilePicture"][0].path
      );
      profilePicturePath = imgUpload.url;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      { _id: id },
      {
        name,
        email,
        universityId,
        universityName,
        universityIdCardImage: universityIdCardImagePath,
        profilePicture: profilePicturePath,
      },
      {
        new: true,
      }
    );

    if (!updatedStudent)
      return res
        .status(404)
        .json({ message: "Student not Updated", success: false });

    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error, success: false });
  }
};

const deleteStudentAccount = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getStudents,
  getStudentsLength,
  getUnverifiedStudentsLength,
  getStudentDetails,
  getAccountRequests,
  updateStudentProfile,
  deleteStudentAccount,
  updateAccountRequestStatus,
};
