const express = require("express");
const {
  getStudents,
  getStudentsLength,
  getUnverifiedStudentsLength,
  getStudentDetails,
  updateStudentProfile,
  deleteStudentAccount,
  updateAccountRequestStatus,
  getAccountRequests,
  deleteManyStudents
} = require("../controllers/studentController");

const { authenticateToken } = require("../middleware/auth");

const upload = require("../upload");

const router = express.Router();

// ✅ Student Account Management
router.get("/", getStudents);
router.get("/length", getStudentsLength);
router.get("/unverified-length", getUnverifiedStudentsLength);
router.get("/account-requests", getAccountRequests);
router.put("/update-status/:id", updateAccountRequestStatus);
router.get("/student/:id", getStudentDetails);
router.put("/update/:id",  upload.fields([
  { name: "universityIdCardImage", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
]), updateStudentProfile);
router.delete("/delete/:id", deleteStudentAccount);
router.delete("/delete-many", deleteManyStudents);

module.exports = router;
