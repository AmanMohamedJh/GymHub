const ContactUs = require("../../../models/Contactus/contactUsModel");

/**
 * Delete a contact message
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Deleted contact message
 */
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactUs.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    await ContactUs.findByIdAndDelete(id);

    res.status(200).json({ message: "Contact message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteContactMessage:", error);
    res.status(500).json({ message: "Failed to delete contact message" });
  }
};

module.exports = deleteContactMessage;
