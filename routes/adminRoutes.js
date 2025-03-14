const express = require("express");

const { authenticateToken } = require("../middleware/auth");

const upload = require("../upload");

const router = express.Router();

// ✅ Student Account Management
router.get("/",)
router.put("/update/:id",)
router.delete("/delete/:id",)

module.exports = router;
