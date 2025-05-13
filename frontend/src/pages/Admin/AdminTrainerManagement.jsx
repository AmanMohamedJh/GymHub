import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaBan,
  FaCertificate,
  FaFileExport,
  FaFilter,
  FaSort,
  FaInfoCircle,
} from "react-icons/fa";
import "./Styles/AdminTrainerManagement.css";
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

const AdminTrainerManagement = () => {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editProfileFormData, setEditProfileFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  const { toast } = useToast();
  const { user } = useAuthContext();

  // Fetch all trainers
  const getTrainers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trainers`, {
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

  // Update a trainer's profile (name, email, phone)
  const updateTrainerProfile = async (id, data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/trainers/${id}/profile`,
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
        error.response?.data?.message || "Failed to update trainer profile"
      );
    }
  };

  const updateTrainerStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/trainers/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update trainer status"
      );
    }
  };

  const deleteTrainer = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/trainers/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete trainer"
      );
    }
  };

  const fetchTrainersData = async () => {
    setIsLoading(true);
    try {
      const data = await getTrainers();
      setTrainers(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching trainers",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainersData();
  }, []);

  const handleEditProfileFormChange = (e) => {
    const { name, value } = e.target;
    setEditProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEditProfile = async (e) => {
    e.preventDefault();
    if (!selectedTrainer) return;

    try {
      await updateTrainerProfile(selectedTrainer.id, editProfileFormData);
      toast({
        title: "Profile Updated",
        description: `${selectedTrainer.name}'s profile has been updated successfully.`,
      });
      fetchTrainersData();
      setIsEditProfileModalOpen(false);
      setSelectedTrainer(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description:
          error instanceof Error ? error.message : "Failed to update profile.",
      });
    }
  };

  const handleToggleStatus = async (trainer, status) => {
    const newStatus = status;
    try {
      await updateTrainerStatus(trainer.id, newStatus);
      toast({
        title: "Status Updated",
        description: `${trainer.name}'s status changed to ${newStatus}.`,
      });
      fetchTrainersData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description:
          error instanceof Error ? error.message : "Failed to update status.",
      });
    }
  };

  const handleOpenDeleteConfirmModal = (trainer) => {
    setSelectedTrainer(trainer);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleDeleteTrainer = async () => {
    if (!selectedTrainer) return;
    try {
      await deleteTrainer(selectedTrainer.id);
      toast({
        title: "Trainer Deleted",
        description: `${selectedTrainer.name} has been deleted.`,
      });
      fetchTrainersData();
      setIsDeleteConfirmModalOpen(false);
      setSelectedTrainer(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting trainer",
        description:
          error instanceof Error ? error.message : "Failed to delete trainer.",
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Specialization",
      "Experience",
      "Gym",
      "Status",
      "Rating",
      "Clients",
      "Certifications",
    ];
    const rows = trainers.map((trainer) => [
      trainer.name,
      trainer.specialization,
      trainer.experience,
      trainer.gym,
      trainer.status,
      trainer.rating,
      trainer.clientCount,
      trainer.certifications.join("; "),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "trainers_report.csv";
    link.click();
  };

  const filteredTrainers = trainers
    .filter((trainer) =>
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((trainer) =>
      filterStatus === "all" ? true : trainer.status === filterStatus
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "clients") return b.clientCount - a.clientCount;
      return 0;
    });

  return (
    <div className="admin-management-container">
      <div className="admin-header">
        <h2>Trainer Management</h2>
        <div className="admin-actions">
          <div className="filter-options">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search trainers..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="filter-options">
            <FaSort className="sort-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="clients">Sort by Clients</option>
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
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Gym</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Clients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainers.map((trainer) => (
                <tr key={trainer.id}>
                  <td>{trainer.name}</td>
                  <td>{trainer.specialization}</td>
                  <td>{trainer.experience}</td>
                  <td>{trainer.gym}</td>
                  <td>
                    <span
                      className={`status-badge status-${trainer.status?.toLowerCase()}`}
                    >
                      {trainer.status}
                    </span>
                  </td>
                  <td>{trainer.rating} / 5</td>
                  <td>{trainer.clientCount}</td>
                  <td className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleToggleStatus(trainer, "pending")}
                      disabled={trainer.status === "pending"}
                      title="Pending trainer"
                    >
                      <FaInfoCircle /> Pending
                    </button>
                    <button
                      className=" btn-approve"
                      onClick={() => handleToggleStatus(trainer, "approved")}
                      disabled={trainer.status === "approved"}
                      title="Approved trainer"
                    >
                      <FaCheckCircle /> Approved
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleToggleStatus(trainer, "rejected")}
                      disabled={trainer.status === "rejected"}
                      title="Rejected trainer"
                    >
                      <FaBan /> Rejected
                    </button>

                    <button
                      onClick={() => handleOpenDeleteConfirmModal(trainer)}
                      className="btn-delete"
                      title="Delete Trainer"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && selectedTrainer && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Trainer Profile - {selectedTrainer.name}</h3>
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
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={editProfileFormData.phone}
                  onChange={handleEditProfileFormChange}
                  required
                />
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
      {isDeleteConfirmModalOpen && selectedTrainer && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedTrainer.name}?</p>
            <div className="form-buttons">
              <button onClick={handleDeleteTrainer} className="btn-delete">
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

export default AdminTrainerManagement;
