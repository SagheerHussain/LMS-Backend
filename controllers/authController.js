const Student = require("../modals/studentModal");
const Admin = require("../modals/adminModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../cloudinary");

const createAccount = async (req, res) => {
  try {
    const { name, email, password, universityId, universityName } = req.body;

    // Cloudinary pr dono images upload karni hain
    const universityIdCardImagePath = await cloudinary.uploader.upload(
      req.files["universityIdCardImage"][0].path
    );
    const profilePicturePath = await cloudinary.uploader.upload(
      req.files["profilePicture"][0].path
    ); // ✅ Cloudinary URL

    const isExist = await Student.findOne({ email });
    if (isExist)
      res.json({ message: "A user with this email is already exist" });

    await bcrypt.genSalt(10, async (err, salt) => {
      await bcrypt.hash(password, salt, async (err, hash) => {
        const newUser = await Student.create({
          name,
          email,
          password: hash,
          universityId,
          universityIdCardImage: universityIdCardImagePath.url,
          profilePicture: profilePicturePath.url,
          universityName,
        });
        res.json({ success: true, user: newUser });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login Attempt:", email, password);
    const user = await Student.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = await jwt.sign({ email: user.email }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name && !email && !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      status: "PENDING",
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createAccount,
  loginAccount,
  registerAdmin,
};
