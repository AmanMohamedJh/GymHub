import axios from "axios";
import { API_BASE_URL } from "../config/constants";

/**
 * Get all contact messages (Admin only)
 * @returns {Promise<Array>} - List of contact messages
 */
export const getContactMessages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/contact-messages`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch contact messages"
    );
  }
};

/**
 * Delete a contact message (Admin only)
 * @param {string} messageId - ID of the message to delete
 * @returns {Promise<Object>} - Response from the server
 */
export const deleteContactMessage = async (messageId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/contact-messages/${messageId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete message"
    );
  }
};

/**
 * Reply to a contact message (Admin only)
 * @param {string} messageId - ID of the message to reply to
 * @param {string} reply - Reply content
 * @returns {Promise<Object>} - Response from the server
 */
export const replyToContactMessage = async (messageId, reply) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/contact-messages/${messageId}/reply`,
      { reply }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send reply");
  }
};

/**
 * Submit a new contact form message (Public)
 * @param {Object} formData - Contact form data
 * @returns {Promise<Object>} - Response from the server
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/contactUs/contactUsAdd`,
      formData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to submit contact form"
    );
  }
};
