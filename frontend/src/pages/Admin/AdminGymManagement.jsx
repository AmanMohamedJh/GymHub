import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaBan,
  FaFilter,
  FaSort,
  FaFileExport,
  FaInfoCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Styles/AdminGymManagement.css";
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

const AdminGymManagement = () => {
  const [gyms, setGyms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGym, setSelectedGym] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editProfileFormData, setEditProfileFormData] = useState({
    name: "",
    location: {
      street: "",
      city: "",
      district: "",
      coordinates: {
        lat: "",
        lng: "",
      },
    },
  });
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  const { toast } = useToast();
  const { user } = useAuthContext();

  // Fetch all gyms
  const getGyms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gyms`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(response.data);
      return response.data;

    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch gyms");
    }
  };

  // Update a gym's profile (name, location)
  const updateGymProfile = async (id, data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/gyms/${id}/profile`,
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
        error.response?.data?.message || "Failed to update gym profile"
      );
    }
  };

  // Update a gym's status
  const updateGymStatus = async (id, status) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/gyms/${id}/status`, {
        status,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update gym status"
      );
    }
  };

  // Delete a gym
  const deleteGym = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/gyms/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete gym");
    }
  };

  const fetchGymsData = async () => {
    setIsLoading(true);
    try {
      const data = await getGyms();
      setGyms(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching gyms",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGymsData();
  }, []);

  const handleOpenEditProfileModal = (gym) => {
    setSelectedGym(gym);
    setEditProfileFormData({
      name: gym.name,
      location: {
        street: gym.location?.street,
        city: gym.location?.city,
        district: gym.location?.district,
        coordinates: {
          lat: gym.location.coordinates?.lat,
          lng: gym.location.coordinates?.lng,
        },
      },
    });
    setIsEditProfileModalOpen(true);
  };

  const handleEditProfileFormChange = (e) => {
    const { name, value } = e.target;
    setEditProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEditProfile = async (e) => {
    e.preventDefault();
    if (!selectedGym) return;

    try {
      await updateGymProfile(selectedGym.id, editProfileFormData);
      toast({
        title: "Profile Updated",
        description: `${selectedGym.name}'s profile has been updated successfully.`,
      });
      fetchGymsData();
      setIsEditProfileModalOpen(false);
      setSelectedGym(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description:
          error instanceof Error ? error.message : "Failed to update profile.",
      });
    }
  };

  const handleToggleStatus = async (gym) => {
    const newStatus = gym.status === "active" ? "inactive" : "active";
    try {
      await updateGymStatus(gym.id, newStatus);
      toast({
        title: "Status Updated",
        description: `${gym.name}'s status changed to ${newStatus}.`,
      });
      fetchGymsData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description:
          error instanceof Error ? error.message : "Failed to update status.",
      });
    }
  };

  const handleOpenDeleteConfirmModal = (gym) => {
    setSelectedGym(gym);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleDeleteGym = async () => {
    if (!selectedGym) return;
    try {
      await deleteGym(selectedGym.id);
      toast({
        title: "Gym Deleted",
        description: `${selectedGym.name} has been deleted.`,
      });
      fetchGymsData();
      setIsDeleteConfirmModalOpen(false);
      setSelectedGym(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting gym",
        description:
          error instanceof Error ? error.message : "Failed to delete gym.",
      });
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Location", "Status", "Members", "Rating"];
    const rows = gyms.map((gym) => [
      gym.name,
      gym.location?.city,
      gym.status,
      gym.members,
      gym.rating,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gyms_report.csv";
    link.click();
  };

  const filteredGyms = gyms
    .filter(
      (gym) =>
        gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((gym) =>
      filterStatus === "all" ? true : gym.status === filterStatus
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "members") return b.members - a.members;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "pending":
        return "status-pending";
      case "inactive":
        return "status-inactive";
      default:
        return "";
    }
  };

  return (
    <div className="admin-management-container">
      <div className="admin-header">
        <h2>Gym Management</h2>
        <div className="admin-actions">
          <div className="filter-options">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search gyms..."
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
              <option value="members">Sort by Members</option>
              <option value="rating">Sort by Rating</option>
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
                  <th>Gym Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Members</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGyms.map((gym) => (
                  <tr key={gym.id}>
                    <td>{gym.name}</td>
                    <td>{gym.location.city}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColor(gym.status)}`}
                      >
                        {gym.status}
                      </span>
                    </td>
                    <td>{gym.members}</td>
                    <td>{gym.rating.toFixed(1)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleToggleStatus(gym)}
                          className="btn-approve"
                          disabled={gym.status === "active"}
                          title="Activate Gym"
                        >
                          <FaCheckCircle /> Activate
                        </button>
                        <button
                          onClick={() => handleToggleStatus(gym)}
                          className="btn-reject"
                          disabled={gym.status === "inactive"}
                          title="Deactivate Gym"
                        >
                          <FaBan /> Deactivate
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleOpenEditProfileModal(gym)}
                          title="Edit Gym"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn-view"
                          onClick={() => console.log("View Details")}
                          title="View Gym Details"
                        >
                          <FaInfoCircle /> Details
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleOpenDeleteConfirmModal(gym)}
                          title="Delete Gym"
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
      {isEditProfileModalOpen && selectedGym && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Gym Profile - {selectedGym.name}</h3>
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
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={editProfileFormData.location.city}
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
      {isDeleteConfirmModalOpen && selectedGym && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedGym.name}?</p>
            <div className="form-buttons">
              <button onClick={handleDeleteGym} className="btn-delete">
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

export default AdminGymManagement;
