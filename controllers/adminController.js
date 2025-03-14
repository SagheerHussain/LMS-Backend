const { Admin } = require("mongodb");

const getAdmins = async () => {
  try {
    const admin = await Admin.find({});
    return res.status(200).json({ success: true, admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateAdmin = async () => {
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

const deleteAdmin = async () => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete({ _id: id });
    return res.status(200).json({ success: true, message: "Admin deleted" });
  } catch (error) {
    return error;
  }
};

module.exports = {
    getAdmins,
    updateAdmin,
    deleteAdmin
}