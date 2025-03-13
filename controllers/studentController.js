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
    const students = await Student.find({ isVerified: false }).select("-password");
    if (students.length < 0)
      return res.status(404).json({ message: "Students not found" });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, universityId, universityName, isVerified } =
      req.body;

    const isExist = await Student.findById(id);
    if (!isExist) return res.status(404).json({ message: "Student not found" });

    let universityIdCardImagePath = isExist.universityIdCardImage;
    let profilePicturePath = isExist.profilePicture;

    if (req.files && req.files["universityIdCardImage"].length > 0) {
      const imgUpload = await cloudinary.uploader.upload(
        req.files["universityIdCardImage"][0].path
      );
      universityIdCardImagePath = imgUpload.url;
    }

    if (req.files && req.files["profilePicture"].length > 0) {
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
        password,
        universityId,
        universityName,
        universityIdCardImage: universityIdCardImagePath,
        profilePicture: profilePicturePath,
        isVerified,
      },
      {
        new: true,
      }
    );

    if (!updatedStudent) return res.status(404).json({ message: "Student not Updated" });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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
  getStudentDetails,
  getAccountRequests,
  updateStudentProfile,
  deleteStudentAccount,
};
