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
    const { id } = req.params;
    const { name, email, password, universityId, universityName } = req.body;

    const isExist = await Student.findById(id);
    if (!isExist) return res.status(404).json({ message: "Student not found" });

    let universityIdCardImagePath = isExist.universityIdCardImage;
    let profilePicturePath = isExist.profilePicture;

    if (req.files["universityIdCardImage"].length > 0) {
      const imgUpload = await cloudinary.uploader.upload(
        req.files["universityIdCardImage"][0].path
      );
      universityIdCardImagePath = imgUpload.url;
    }

    if (req.files["profilePicture"].length > 0) {
      const imgUpload = await cloudinary.uploader.upload(
        req.files["profilePicture"][0].path
      );
      profilePicturePath = imgUpload.url;
    }

    const student = await Student.findByIdAndUpdate(id, {
      name,
      email,
      password,
      universityId,
      universityName,
      universityIdCardImage: universityIdCardImagePath,
      profilePicture: profilePicturePath,
    }, {
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
    const { id } = req.params;
    await Student.findByIdAndDelete({_id: id });
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
