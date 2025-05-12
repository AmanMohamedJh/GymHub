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
} from "react-icons/fa";
import "./Styles/AdminTrainerManagement.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// Fetch all trainers
const getTrainers = async () => {
  try {
    // const response = await axios.get(`${API_BASE_URL}/trainers`);
    // return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: "John Doe",
            specialization: "Weightlifting",
            experience: "5 years",
            gym: "Gold's Gym",
            status: "active",
            rating: 4.5,
            clientCount: 20,
            certifications: ["ACE", "NSCA"],
          },
          {
            id: 2,
            name: "Jane Smith",
            specialization: "Yoga",
            experience: "3 years",
            gym: "Planet Fitness",
            status: "suspended",
            rating: 4.0,
            clientCount: 15,
            certifications: ["Yoga Alliance"],
          },
          {
            id: 3,
            name: "Mike Johnson",
            specialization: "CrossFit",
            experience: "7 years",
            gym: "CrossFit Box",
            status: "active",
            rating: 4.8,
            clientCount: 30,
            certifications: ["CrossFit Level 1"],
          },
          {
            id: 4,
            name: "Emily Davis",
            specialization: "Pilates",
            experience: "4 years",
            gym: "Anytime Fitness",
            status: "pending",
            rating: 4.2,
            clientCount: 10,
            certifications: ["Pilates Method Alliance"],
          },
          {
            id: 5,
            name: "Chris Brown",
            specialization: "Nutrition",
            experience: "6 years",
            gym: "LA Fitness",
            status: "active",
            rating: 4.7,
            clientCount: 25,
            certifications: ["CISSN", "Precision Nutrition"],
          },
          {
            id: 6,
            name: "Sarah Wilson",
            specialization: "Zumba",
            experience: "2 years",
            gym: "YMCA",
            status: "suspended",
            rating: 3.9,
            clientCount: 12,
            certifications: ["Zumba Instructor"],
          },
          {
            id: 7,
            name: "David Lee",
            specialization: "Boxing",
            experience: "8 years",
            gym: "Boxing Club",
            status: "active",
            rating: 4.6,
            clientCount: 18,
            certifications: ["USA Boxing Coach"],
          },
          {
            id: 8,
            name: "Laura Taylor",
            specialization: "Dance",
            experience: "3 years",
            gym: "Dance Studio",
            status: "pending",
            rating: 4.1,
            clientCount: 14,
            certifications: ["Dance Teacher Certification"],
          },
          {
            id: 9,
            name: "Daniel Martinez",
            specialization: "Strength Training",
            experience: "5 years",
            gym: "24 Hour Fitness",
            status: "active",
            rating: 4.4,
            clientCount: 22,
            certifications: ["CSCS", "NSCA-CPT"],
          },
          {
            id: 10,
            name: "Sophia Anderson",
            specialization: "Cardio",
            experience: "4 years",
            gym: "Gold's Gym",
            status: "suspended",
            rating: 3.8,
            clientCount: 11,
            certifications: ["AFAA Group Fitness Instructor"],
          },
        ]);
      }, 1000);
    });
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
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update trainer profile"
    );
  }
};

const updateTrainerCertifications = async (id, certifications) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/trainers/${id}/certifications`,
      { certifications }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update certifications"
    );
  }
};

const updateTrainerStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/trainers/${id}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update trainer status"
    );
  }
};

const deleteTrainer = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/trainers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete trainer"
    );
  }
};

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

  const [isManageCertsModalOpen, setIsManageCertsModalOpen] = useState(false);
  const [certsFormData, setCertsFormData] = useState("");

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  const { toast } = useToast();

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

  const handleOpenEditProfileModal = (trainer) => {
    setSelectedTrainer(trainer);
    setEditProfileFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
    });
    setIsEditProfileModalOpen(true);
  };

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

  const handleOpenManageCertsModal = (trainer) => {
    setSelectedTrainer(trainer);
    setCertsFormData(trainer.certifications.join("\n"));
    setIsManageCertsModalOpen(true);
  };

  const handleCertsFormChange = (e) => {
    setCertsFormData(e.target.value);
  };

  const handleSubmitManageCerts = async (e) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    const newCertifications = certsFormData
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await updateTrainerCertifications(selectedTrainer.id, newCertifications);
      toast({
        title: "Certifications Updated",
        description: `${selectedTrainer.name}'s certifications have been updated.`,
      });
      fetchTrainersData();
      setIsManageCertsModalOpen(false);
      setSelectedTrainer(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating certifications",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update certifications.",
      });
    }
  };

  const handleToggleStatus = async (trainer) => {
    const newStatus = trainer.status === "active" ? "suspended" : "active";
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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
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
                      className={`status-badge status-${trainer.status.toLowerCase()}`}
                    >
                      {trainer.status}
                    </span>
                  </td>
                  <td>{trainer.rating} / 5</td>
                  <td>{trainer.clientCount}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleToggleStatus(trainer)}
                      className="btn-approve"
                      disabled={trainer.status === "active"}
                      title="Activate Trainer"
                    >
                      <FaCheckCircle /> Activate
                    </button>
                    <button
                      onClick={() => handleToggleStatus(trainer)}
                      className="btn-reject"
                      disabled={trainer.status === "suspended"}
                      title="Suspend Trainer"
                    >
                      <FaBan /> Suspend
                    </button>
                    <button
                      onClick={() => handleOpenEditProfileModal(trainer)}
                      className="btn-edit"
                      title="Edit Trainer"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleOpenManageCertsModal(trainer)}
                      className="btn-view"
                      title="Manage Certifications"
                    >
                      <FaCertificate /> Certs
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

      {/* Manage Certifications Modal */}
      {isManageCertsModalOpen && selectedTrainer && (
        <div className="modal">
          <div className="modal-content">
            <h3>Manage Certifications - {selectedTrainer.name}</h3>
            <form onSubmit={handleSubmitManageCerts}>
              <div className="form-group">
                <label>Certifications (one per line):</label>
                <textarea
                  value={certsFormData}
                  onChange={handleCertsFormChange}
                  rows={5}
                  placeholder="Enter certifications, one per line"
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn-save">
                  Save Certifications
                </button>
                <button
                  type="button"
                  onClick={() => setIsManageCertsModalOpen(false)}
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
