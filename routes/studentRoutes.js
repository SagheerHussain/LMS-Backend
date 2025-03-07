const express = require("express");
const {
  getStudents,
  getStudentDetails,
  updateStudentProfile,
  deleteStudentAccount
} = require("../controllers/studentController");

const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// ✅ Student Account Management
router.get("/", getStudents);
router.get("/:studentId", authenticateToken, getStudentDetails);
router.put("/update/:studentId", updateStudentProfile);
router.delete("/delete/:studentId", deleteStudentAccount);

module.exports = router;
