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

    const user = await Student.findOne({ email }) || await Admin.findOne({ email });

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
  console.log(req.body);  
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

    res.status(201).json({ success: true, admin: user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const forgetPassword = async (req, res) => {
  try {
      const { email } = req.body;
      const user = await Student.findOne({ email }) || await Admin.findOne({ email });
      if (!user) res.status(404).json({ message: "User is not exist", success: false });
      else {
          const token = await jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: "1d" });

          const transporter = nodemailer.createTransport({
              service: 'gmail',
              secure: true,
              auth: {
                  user: `${process.env.MY_GMAIL}`,
                  pass: `${process.env.MY_PASSWORD}`
              }
          });

          const mailOptions = {
              from: `${process.env.MY_GMAIL}`,
              to: email,
              subject: 'Reset Your Password',
              text: `Click on this link to reset your password : http://localhost:5173/reset-password/${token}`
          };

          await transporter.sendMail(mailOptions);

          res.status(200).json({ message: "Verification Link Has Been Send To Your Email", success: true });
      }
  } catch (error) {
      res.status(404).json({ message: "Something Went Wrong", success: false });
  }
}

const resetPassword = async (req, res) => {
  try {
      const { token } = req.params;
      const { password } = req.body;

      const decode = await jwt.verify(token, process.env.JWT_KEY);
      console.log(token, password, decode)
      const user = await Student.findOne({ email: decode.email }) || await Admin.findOne({ email: decode.email });

      if (user) {
          const newpassword = await bcrypt.hash(password, 12);
          const updatedUser = await Student.findOneAndUpdate({ email: decode.email }, { password: newpassword });
          updatedUser.save();
          res.status(200).json({ message: "Password Has Been Saved Succcessfully", success: true });
      } else {
          res.status(200).json({ message: "User not found", success: false });
      }

  } catch (error) {
      res.status(404).json({ message: "Something Went Wrong", success: false });
  }
}

module.exports = {
  createAccount,
  loginAccount,
  registerAdmin,
  forgetPassword,
  resetPassword
};
