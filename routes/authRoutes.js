const express = require("express");
const {
  createAccount,
  loginAccount,
  registerAdmin,
} = require("../controllers/authController");
const upload = require("../upload");

const router = express.Router();

// ✅ Authentication
router.post(
  "/register",
  upload.fields([
    { name: "universityIdCardImage", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
  ]),
  createAccount
);
router.post("/login", loginAccount);
router.post("/admin", registerAdmin);

module.exports = router;
