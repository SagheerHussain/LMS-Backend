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

const updatePaymentMethod = async (req, res) => {
  try {
      const { method } = req.body;
      const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(req.params.id, { method }, { new: true });
      if (!updatedPaymentMethod) return res.status(404).json({ message: 'Payment method not found' });
      res.json({ message: 'Payment method updated successfully', paymentMethod: updatedPaymentMethod });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
