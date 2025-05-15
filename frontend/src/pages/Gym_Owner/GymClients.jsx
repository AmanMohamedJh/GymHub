import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Styles/GymClients.css";
import { FaEye, FaEdit, FaTrash, FaEnvelope } from "react-icons/fa";

const statusColors = {
  active: "status-active",
  paused: "status-paused",
  suspended: "status-suspended",
  inactive: "status-inactive",
  completed: "status-completed",
};
const statusOptions = [
  "active",
  "paused",
  "suspended",
  "inactive",
  "completed",
];

function GymClients() {
  const { gymId } = useParams();
  const { user } = useAuthContext();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // --- Contact Modal State ---
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");

  // Fetch real data
  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/gymOwner/gyms/${gymId}/Clientregistrations`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        setClients(data);
      } catch (err) {
        setError(err.message || "Error fetching clients");
      } finally {
        setLoading(false);
      }
    }
    if (gymId) fetchClients();
  }, [gymId, user]);

  // Filtering
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      client.email?.toLowerCase().includes(search.toLowerCase()) ||
      client.phone?.includes(search);
    const matchesStatus = statusFilter ? client.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleView = (client) => {
    setSelectedClient(client);
    setShowDrawer(true);
  };
  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedClient(null);
  };
  const handleStatusChange = async (id, newStatus) => {
    try {
      const client = clients.find((c) => c._id === id);
      if (!client || client.status === newStatus) return;
      const res = await fetch(
        `/api/gymOwner/gyms/${gymId}/Clientregistrations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setClients((prev) =>
        prev.map((c) => (c._id === id ? updated.registration : c))
      );
    } catch (err) {
      alert(err.message || "Error updating status");
    }
  };
  const handleDelete = async (registrationId, gymId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this client from the gym?"
      )
    )
      return;
    try {
      const res = await fetch(
        `/api/gymOwner/gyms/${gymId}/Clientregistrations/${registrationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete client");
      setClients((prev) => prev.filter((c) => c._id !== registrationId));
      setSelectedRows((prev) => prev.filter((row) => row !== registrationId));
      if (selectedClient && selectedClient._id === registrationId) handleCloseDrawer();
    } catch (err) {
      alert(err.message || "Error deleting client");
    }
  };
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (selectedRows.length === filteredClients.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredClients.map((c) => c._id));
    }
  };
  const handleBulkStatus = async (newStatus) => {
    for (const id of selectedRows) {
      await handleStatusChange(id, newStatus);
    }
    setSelectedRows([]);
  };
  // --- Contact Button Handler ---
  const handleContact = (client) => {
    setSelectedClient(client);
    setContactSubject("");
    setContactMessage("");
    setContactError("");
    setContactSuccess("");
    setShowContactModal(true);
  };

  // --- Send Email to Client ---
  const handleSendContact = async () => {
    setContactSending(true);
    setContactError("");
    setContactSuccess("");
    try {
      const res = await fetch("/api/client/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedClient.email,
          subject: contactSubject || "Message from Gym Owner",
          message: contactMessage,
        }),
      });
      if (!res.ok) throw new Error("Failed to send email");
      setContactSuccess("Message sent successfully!");
      setContactMessage("");
      setContactSubject("");
      setTimeout(() => setShowContactModal(false), 1500);
    } catch (err) {
      setContactError(err.message || "Failed to send email");
    } finally {
      setContactSending(false);
    }
  };

  return (
    <div className="gym-clients-modern-bg">
      <div className="gym-clients-modern-container">
        <div className="clients-header-modern">
          <h2>Clients</h2>
          <div className="clients-actions-modern">
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar-modern"
              style={{ minWidth: 300, width: "340px", marginRight: 10 }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter-modern"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            {/* Bulk action buttons */}
            {selectedRows.length > 0 && (
              <div className="bulk-actions-modern">
                <span
                  style={{ marginRight: 8, color: "#635bff", fontWeight: 600 }}
                >
                  Bulk actions:
                </span>
                <button
                  className="action-btn-modern view"
                  title="Set Active"
                  onClick={() => handleBulkStatus("active")}
                >
                  Set Active
                </button>
                <button
                  className="action-btn-modern edit"
                  title="Set Paused"
                  onClick={() => handleBulkStatus("paused")}
                >
                  Set Paused
                </button>
                <button
                  className="action-btn-modern remove"
                  title="Set Suspended"
                  onClick={() => handleBulkStatus("suspended")}
                >
                  Set Suspended
                </button>
                <button
                  className="action-btn-modern remove"
                  title="Remove Selected"
                  onClick={async () => {
                    for (const id of selectedRows) await handleDelete(id);
                    setSelectedRows([]);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div
            style={{ textAlign: "center", margin: "40px 0", color: "#635bff" }}
          >
            Loading clients...
          </div>
        ) : error ? (
          <div
            style={{ textAlign: "center", margin: "40px 0", color: "#d32f2f" }}
          >
            {error}
          </div>
        ) : (
          <div className="clients-table-wrapper-modern">
            <table className="clients-table-modern">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === filteredClients.length &&
                        filteredClients.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Client</th>
                  <th>Fitness Goal</th>
                  <th>Fitness Level</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((registration) => (
                  <tr
                    key={registration._id}
                    className={
                      registration.needsAttention ? "row-attention-modern" : ""
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(registration._id)}
                        onChange={() => handleSelectRow(registration._id)}
                      />
                    </td>
                    <td className="client-cell-modern">
                      <div className="client-profile-modern">
                        <div className="dummy-profile-icon-modern">
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 36 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="18" cy="18" r="18" fill="#F1F3F6" />
                            <ellipse
                              cx="18"
                              cy="13.5"
                              rx="7"
                              ry="7.5"
                              fill="#BFC8D7"
                            />
                            <ellipse
                              cx="18"
                              cy="27.5"
                              rx="12"
                              ry="7.5"
                              fill="#BFC8D7"
                            />
                          </svg>
                        </div>
                        <div className="client-info-modern">
                          <span className="client-name-modern">
                            {registration.fullName}
                          </span>
                          <span className="client-email-modern">
                            {registration.email}
                          </span>
                          <span className="client-phone-modern">
                            {registration.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{registration.fitnessGoals}</td>
                    <td>{registration.fitnessLevel}</td>
                    <td>
                      <select
                        value={registration.status}
                        className={`status-badge-modern ${
                          statusColors[registration.status]
                        }`}
                        style={{ minWidth: 110 }}
                        // Always use registration._id for status change
                        onChange={(e) =>
                          handleStatusChange(registration._id, e.target.value)
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {registration.startDate &&
                        new Date(registration.startDate).toLocaleDateString()}
                    </td>
                    <td>
                      {/* All actions below use registration._id */}
                      <button
                        className="action-btn-modern view"
                        title="View"
                        onClick={() => handleView(registration)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-btn-modern contact"
                        title="Contact"
                        onClick={() => handleContact(registration)}
                      >
                        <FaEnvelope />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="no-clients-modern">
                      No clients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Profile Drawer/Modal */}
        {showDrawer && selectedClient && (
          <div
            className="profile-drawer-overlay-modern"
            onClick={handleCloseDrawer}
          >
            <div
              className="profile-drawer-modern"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="drawer-close-modern"
                onClick={handleCloseDrawer}
              >
                ×
              </button>
              <h3>{selectedClient.fullName}'s Profile</h3>
              <div className="profile-section-modern">
                <strong>Full Name:</strong> {selectedClient.fullName}
              </div>
              <div className="profile-section-modern">
                <strong>Email:</strong> {selectedClient.email}
              </div>
              <div className="profile-section-modern">
                <strong>Phone:</strong> {selectedClient.phone}
              </div>
              <div className="profile-section-modern">
                <strong>Date of Birth:</strong>{" "}
                {selectedClient.dob
                  ? new Date(selectedClient.dob).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="profile-section-modern">
                <strong>Age:</strong> {selectedClient.age ?? "N/A"}
              </div>
              <div className="profile-section-modern">
                <strong>Gender:</strong> {selectedClient.gender || "N/A"}
              </div>
              <div className="profile-section-modern">
                <strong>Fitness Level:</strong> {selectedClient.fitnessLevel}
              </div>
              <div className="profile-section-modern">
                <strong>Fitness Goals:</strong> {selectedClient.fitnessGoals}
              </div>
              <div className="profile-section-modern">
                <strong>Medical:</strong> {selectedClient.medical}
              </div>
              <div className="profile-section-modern">
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge-modern ${
                    statusColors[selectedClient.status]
                  }`}
                >
                  {selectedClient.status.charAt(0).toUpperCase() +
                    selectedClient.status.slice(1)}
                </span>
              </div>
              <div className="profile-section-modern">
                <strong>Start Date:</strong>{" "}
                {selectedClient.startDate &&
                  new Date(selectedClient.startDate).toLocaleDateString()}
              </div>
              {selectedClient.emergencyContact && (
                <div className="profile-section-modern">
                  <strong>Emergency Contact:</strong>
                  <br />
                  Name: {selectedClient.emergencyContact.name}
                  <br />
                  Phone: {selectedClient.emergencyContact.phone}
                  <br />
                  Relation: {selectedClient.emergencyContact.relation}
                </div>
              )}
              <div className="profile-actions-modern">
                <button
                  className="action-btn-modern contact"
                  title="Contact"
                  onClick={() => handleContact(selectedClient)}
                >
                  <FaEnvelope />
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Contact Client Modal */}
        {showContactModal && selectedClient && (
          <div
            className="modal-overlay"
            onClick={() => setShowContactModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Contact {selectedClient.fullName}</h3>
              <label>To:</label>
              <input
                type="email"
                value={selectedClient.email}
                disabled
                style={{ width: "100%" }}
              />
              <label>Subject:</label>
              <input
                type="text"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Subject"
                style={{ width: "100%" }}
              />
              <label>Message:</label>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={5}
                placeholder="Type your message here..."
                style={{ width: "100%" }}
              />
              {contactError && (
                <div className="error-message">{contactError}</div>
              )}
              {contactSuccess && (
                <div className="success-message">{contactSuccess}</div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button
                  onClick={() => setShowContactModal(false)}
                  disabled={contactSending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendContact}
                  disabled={contactSending || !contactMessage.trim()}
                  style={{ background: "#d32f2f", color: "white" }}
                >
                  {contactSending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GymClients;
