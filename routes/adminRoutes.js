const express = require("express");

const { getAdmins, getAdminById, updateAdmin, deleteAdmin } = require("../controllers/adminController");

const { authenticateToken } = require("../middleware/auth");

const upload = require("../upload");

const router = express.Router();

// ✅ Student Account Management
router.get("/", authenticateToken, getAdmins);
router.get("/:id", authenticateToken, getAdminById);
router.put("/update/:id", authenticateToken, updateAdmin);
router.delete("/delete/:id", authenticateToken, deleteAdmin);

module.exports = router;
