import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaUser,
  FaFilter,
  FaSort,
  FaCheckCircle,
  FaBan,
  FaFileExport,
  FaInfoCircle,
} from "react-icons/fa";
import "./Styles/AdminClientManagement.css";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";

const API_BASE_URL = "http://localhost:4000/api/admin";

const useToast = () => {
  return {
    toast: ({ title, description, variant }) => {
      console.log(`Toast: ${title} - ${description} ${variant || ""}`);
    },
  };
};
const AdminClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editProfileFormData, setEditProfileFormData] = useState({
    name: "",
    email: "",
    membershipType: "",
  });
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  const { toast } = useToast();
  const { user } = useAuthContext();

  const getClients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch trainers"
      );
    }
  };

  // Update a client's profile
  const updateClientProfile = async (id, data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/clients/${id}/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update client profile"
      );
    }
  };

  // Update a client's status
  const updateClientStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/clients/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update client status"
      );
    }
  };

  // Delete a client
  const deleteClient = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete client"
      );
    }
  };

  const fetchClientsData = async () => {
    setIsLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching clients",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientsData();
  }, []);

  const handleOpenEditProfileModal = (client) => {
    setSelectedClient(client);
    setEditProfileFormData({
      name: client.name,
      email: client.email,
      membershipType: client.membershipType,
    });
    setIsEditProfileModalOpen(true);
  };

  const handleEditProfileFormChange = (e) => {
    const { name, value } = e.target;
    setEditProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEditProfile = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      await updateClientProfile(selectedClient.id, editProfileFormData);
      toast({
        title: "Profile Updated",
        description: `${selectedClient.name}'s profile has been updated successfully.`,
      });
      fetchClientsData();
      setIsEditProfileModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description:
          error instanceof Error ? error.message : "Failed to update profile.",
      });
    }
  };

  const handleToggleStatus = async (client) => {
    const newStatus = client.status === "Active" ? "Inactive" : "Active";
    try {
      await updateClientStatus(client.id, newStatus);
      toast({
        title: "Status Updated",
        description: `${client.name}'s status changed to ${newStatus}.`,
      });
      fetchClientsData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description:
          error instanceof Error ? error.message : "Failed to update status.",
      });
    }
  };

  const handleOpenDeleteConfirmModal = (client) => {
    setSelectedClient(client);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      await deleteClient(selectedClient.id);
      toast({
        title: "Client Deleted",
        description: `${selectedClient.name} has been deleted.`,
      });
      fetchClientsData();
      setIsDeleteConfirmModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting client",
        description:
          error instanceof Error ? error.message : "Failed to delete client.",
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Membership Type",
      "Gym",
      "Status",
      "Join Date",
      "Last Active",
      "Payment Status",
      "Attendance",
    ];
    const rows = clients.map((client) => [
      client.name,
      client.email,
      client.membershipType,
      client.gym,
      client.status,
      client.joinDate,
      client.lastActive,
      client.paymentStatus,
      client.attendance,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "clients_report.csv";
    link.click();
  };

  const filteredClients = clients
    .filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.gym.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((client) =>
      filterStatus === "all"
        ? true
        : client.status.toLowerCase() === filterStatus.toLowerCase()
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") return new Date(b.joinDate) - new Date(a.joinDate);
      if (sortBy === "attendance") return b.attendance - a.attendance;
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Inactive":
        return "status-inactive";
      default:
        return "";
    }
  };

  return (
    <div className="admin-management-container">
      <div className="admin-header">
        <h2>Client Management</h2>
        <div className="admin-actions">
          <div className="filter-options">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-options">
            <FaFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="filter-options">
            <FaSort className="sort-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Join Date</option>
              <option value="attendance">Sort by Attendance</option>
            </select>
          </div>
          <button className="filter-options-button" onClick={exportToCSV}>
            <FaFileExport className="export-icon" />
            <span className="export-button-text">Export Report</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="management-content">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gym</th>
                  <th>Membership</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="user-info">
                        <FaUser className="user-icon" />
                        <span>{client.name}</span>
                      </div>
                    </td>
                    <td>{client.email}</td>
                    <td>{client.gym}</td>
                    <td>
                      <span
                        className={`membership-badge ${client.membershipType.toLowerCase()}`}
                      >
                        {client.membershipType}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColor(
                          client.status
                        )}`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => handleToggleStatus(client)}
                          disabled={client.status === "Active"}
                          title="Activate Client"
                        >
                          <FaCheckCircle /> Activate
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleToggleStatus(client)}
                          disabled={client.status === "Inactive"}
                          title="Deactivate Client"
                        >
                          <FaBan /> Deactivate
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleOpenEditProfileModal(client)}
                          title="Edit Client"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn-view"
                          onClick={() => console.log("View Details")} // Placeholder for details view
                          title="View Client Details"
                        >
                          <FaInfoCircle /> Details
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleOpenDeleteConfirmModal(client)}
                          title="Delete Client"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && selectedClient && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Client Profile - {selectedClient.name}</h3>
            <form onSubmit={handleSubmitEditProfile}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editProfileFormData.name}
                  onChange={handleEditProfileFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editProfileFormData.email}
                  onChange={handleEditProfileFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Membership Type:</label>
                <select
                  name="membershipType"
                  value={editProfileFormData.membershipType}
                  onChange={handleEditProfileFormChange}
                  required
                >
                  <option value="Premium">Premium</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmModalOpen && selectedClient && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedClient.name}?</p>
            <div className="form-buttons">
              <button onClick={handleDeleteClient} className="btn-delete">
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeleteConfirmModalOpen(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientManagement;
