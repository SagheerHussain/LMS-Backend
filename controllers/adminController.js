const Admin = require("../modals/adminModal");

const getAdmins = async (req, res) => {
  try {
    const admin = await Admin.find({});
    return res.status(200).json({ success: true, admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById({ _id: id });
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    return res.status(200).json({ success: true, admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, status } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      { _id: id },
      { name, email, password, status },
      { new: true }
    );
    return res.status(200).json({ success: true, admin: updatedAdmin });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete({ _id: id });
    return res.status(200).json({ success: true, message: "Admin deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
