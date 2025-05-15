import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaTimes,
  FaTools,
  FaCalendarAlt,
  FaTrash,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaChartBar,
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaWarehouse,
  FaBoxOpen,
} from "react-icons/fa";
import "./Styles/EquipmentManagement.css";
import { useAuthContext } from "../../hooks/useAuthContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const EquipmentManagement = () => {
  const { user } = useAuthContext();
  // State variables for modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [userGyms, setUserGyms] = useState([]);
  const [error, setError] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    gymId: "",
    condition: "Excellent",
    notes: "",
    inInventory: false,
  });

  // State for maintenance form
  const [maintenanceForm, setMaintenanceForm] = useState({
    scheduledDate: "",
    type: "Routine",
    description: "",
    status: "Scheduled",
  });

  // State for maintenance history
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (equipment) => {
    setSelectedEquipment(equipment);
    setFormData({
      name: equipment.name,
      gymId: equipment.gymId || "",
      condition: equipment.condition,
      notes: equipment.notes || "",
      inInventory: !equipment.gymId,
    });
    setShowEditModal(true);
  };

  const handleMaintenanceClick = (equipment) => {
    setSelectedEquipment(equipment);
    setMaintenanceForm({
      scheduledDate: "",
      type: "Routine",
      description: "",
      status: "Scheduled",
    });
    fetchMaintenanceHistory(equipment._id);
    setShowMaintenanceModal(true);
  };

  const handleDeleteClick = (equipment) => {
    setSelectedEquipment(equipment);
    setShowDeleteModal(true);
  };

  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:4000/api/equipment/${selectedEquipment._id}/maintenance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(maintenanceForm),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      // Update maintenance history
      setMaintenanceHistory((prevHistory) => [...prevHistory, json]);

      // Reset form and close modal
      setMaintenanceForm({
        scheduledDate: "",
        type: "Routine",
        description: "",
        status: "Scheduled",
      });
      setShowMaintenanceModal(false);
      setError(null);
    } catch (error) {
      console.error("Maintenance submission error:", error);
      setError("Failed to schedule maintenance");
    }
  };

  const handleDelete = async () => {
    if (!selectedEquipment) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/equipment/${selectedEquipment._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted equipment from the list
      setEquipmentList((prev) =>
        prev.filter((item) => item._id !== selectedEquipment._id)
      );
      setShowDeleteModal(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error("Delete equipment error:", error);
      setError("Failed to delete equipment");
    }
  };

  const handleAddNewClick = () => {
    setSelectedEquipment(null);
    setFormData({
      name: "",
      gymId: "",
      condition: "Excellent",
      notes: "",
      inInventory: false,
    });
    setShowEditModal(true);
  };

  const handleReports = () => {
    setShowReportsModal(true);
  };

  // Fetch user's gyms
  const fetchUserGyms = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/equipment/owner-gyms",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserGyms(data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to fetch gyms:", error);
      setError("Failed to fetch gyms");
    }
  };

  // Fetch all equipment
  const fetchEquipment = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/equipment/owner",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setEquipmentList(json);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch equipment");
    }
  };

  // Fetch maintenance history
  const fetchMaintenanceHistory = async (equipmentId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/equipment/${equipmentId}/maintenance`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setMaintenanceHistory(json);
    } catch (error) {
      console.error("Failed to fetch maintenance history:", error);
      setError("Failed to fetch maintenance history");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedEquipment
        ? `http://localhost:4000/api/equipment/${selectedEquipment._id}`
        : "http://localhost:4000/api/equipment";

      const response = await fetch(url, {
        method: selectedEquipment ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save equipment");
      }

      const data = await response.json();
      if (selectedEquipment) {
        setEquipmentList((prev) =>
          prev.map((item) => (item._id === selectedEquipment._id ? data : item))
        );
      } else {
        setEquipmentList((prev) => [...prev, data]);
      }
      setShowEditModal(false);
      setFormData({
        name: "",
        gymId: "",
        condition: "Excellent",
        notes: "",
        inInventory: false,
      });
      setError(null);
    } catch (error) {
      console.error("Failed to save equipment:", error);
      setError(error.message);
    }
  };

  const handleStatusUpdate = async (maintenanceId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/equipment/${selectedEquipment._id}/maintenance/${maintenanceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      // Update maintenance history with the updated record
      setMaintenanceHistory((prevHistory) =>
        prevHistory.map((record) =>
          record._id === maintenanceId
            ? { ...record, status: newStatus }
            : record
        )
      );

      // Refresh equipment data to get latest status
      await fetchEquipment();
    } catch (error) {
      console.error("Status update error:", error);
      setError("Failed to update maintenance status");
    }
  };

  const handleMaintenanceDelete = async (maintenanceId) => {
    if (!maintenanceId) {
      setError("No maintenance record selected");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/equipment/maintenance/${maintenanceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted maintenance from history
      setMaintenanceHistory((prevHistory) =>
        prevHistory.filter((record) => record._id !== maintenanceId)
      );

      // Refresh equipment data
      await fetchEquipment();
    } catch (error) {
      console.error("Failed to delete maintenance:", error);
      setError("Failed to delete maintenance record");
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchUserGyms();
      fetchEquipment();
    }
  }, [user]);

  // Check for due maintenance on component mount and every hour
  useEffect(() => {
    const checkDueMaintenance = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/equipment/maintenance/due",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        // If response is not ok, throw error
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length > 0) {
          // Show notification for due maintenance
          data.forEach((item) => {
            if (!item.notificationSent) {
              // You can replace this with a proper notification system
              const message = `Maintenance due for ${item.equipmentName}: ${item.description}`;
              console.log("Maintenance notification:", message);
              // Only show alert if it's a new notification
              alert(message);
            }
          });
        }
      } catch (error) {
        // Log error but don't show to user unless it's a specific error we want them to see
        console.error("Failed to check due maintenance:", error);
      }
    };

    // Only run if user is authenticated
    if (user) {
      checkDueMaintenance();
      const interval = setInterval(checkDueMaintenance, 3600000); // Check every hour
      return () => clearInterval(interval);
    }
  }, [user]);

  // Filter and sort functions
  const getFilteredEquipment = () => {
    return equipmentList
      .filter((equipment) => {
        // Search filter
        const searchMatch =
          !searchTerm ||
          equipment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          equipment.condition
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          equipment.gymName?.toLowerCase().includes(searchTerm.toLowerCase());

        // Condition filter
        const conditionMatch =
          filterCondition === "all" ||
          equipment.condition?.toLowerCase() === filterCondition.toLowerCase();

        return searchMatch && conditionMatch;
      })
      .sort((a, b) => {
        // Handle undefined or null values
        const aValue = a[sortField] || "";
        const bValue = b[sortField] || "";

        // Sort direction
        const direction = sortDirection === "asc" ? 1 : -1;

        // Case insensitive string comparison
        return (
          direction *
          aValue
            .toString()
            .toLowerCase()
            .localeCompare(bValue.toString().toLowerCase())
        );
      });
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredEquipment = getFilteredEquipment();

  return (
    <div className="equipment-management">
      <div className="equipment-header">
        <h1>
          <FaTools /> Equipment Management
        </h1>
        <p>Track, maintain and manage all your gym equipment in one place</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="equip-actions-bar">
        <div className="equip-search-filter">
          <div className="equip-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="equip-filters">
            <div className="equip-filter-item">
              <label>Condition:</label>
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
              >
                <option value="all">All Conditions</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="equip-action-buttons">
          <button className="equip-btn-add" onClick={handleAddNewClick}>
            <FaPlus /> Add New Equipment
          </button>
          <button className="equip-btn-reports" onClick={handleReports}>
            <FaChartBar /> Reports
          </button>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="equip-table-container">
        <table className="equip-table">
          <thead>
            <tr>
              <th onClick={() => handleSortChange("name")}>
                Equipment Name
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <FaSortAmountUp />
                  ) : (
                    <FaSortAmountDown />
                  ))}
              </th>
              <th onClick={() => handleSortChange("gymName")}>
                Gym Name
                {sortField === "gymName" &&
                  (sortDirection === "asc" ? (
                    <FaSortAmountUp />
                  ) : (
                    <FaSortAmountDown />
                  ))}
              </th>
              <th onClick={() => handleSortChange("condition")}>
                Condition
                {sortField === "condition" &&
                  (sortDirection === "asc" ? (
                    <FaSortAmountUp />
                  ) : (
                    <FaSortAmountDown />
                  ))}
              </th>
              <th>Last Maintenance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((equipment) => (
                <tr key={equipment._id}>
                  <td>{equipment.name}</td>
                  <td>
                    {!equipment.inInventory ? (
                      <span className="gym-name">
                        <FaWarehouse className="gym-icon" />{" "}
                        {equipment.gymId?.name}
                      </span>
                    ) : (
                      <span className="no-gym">
                        <FaBoxOpen className="inventory-icon" /> Inventory
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`equip-condition equip-condition-${equipment.condition.toLowerCase()}`}
                    >
                      {equipment.condition}
                    </span>
                  </td>
                  <td>
                    {equipment.lastMaintenanceDate
                      ? new Date(
                          equipment.lastMaintenanceDate
                        ).toLocaleDateString()
                      : "Not recorded"}
                  </td>
                  <td className="equip-actions">
                    <button
                      className="equip-btn-icon equip-btn-edit"
                      onClick={() => handleEditClick(equipment)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="equip-btn-icon equip-btn-maintenance"
                      onClick={() => handleMaintenanceClick(equipment)}
                    >
                      <FaTools />
                    </button>
                    <button
                      className="equip-btn-icon equip-btn-delete"
                      onClick={() => handleDeleteClick(equipment)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="equip-no-data">
                  No equipment found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Equipment Modal */}
      {showEditModal && (
        <div className="equip-modal-overlay">
          <div className="equip-modal equip-form-modal">
            <div className="equip-modal-header">
              <h3>
                <FaSave />{" "}
                {selectedEquipment ? "Edit Equipment" : "Add New Equipment"}
              </h3>
              <button
                className="equip-modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="equip-modal-content">
              <form onSubmit={handleSubmit}>
                <div className="equip-form-group">
                  <label>Equipment Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter equipment name"
                  />
                </div>

                <div className="equip-form-group">
                  <label>Assign to Gym</label>
                  <select
                    name="gymId"
                    value={formData.gymId}
                    onChange={handleInputChange}
                    disabled={formData.inInventory}
                  >
                    <option value="">Select a gym</option>
                    {userGyms.map((gym) => (
                      <option key={gym._id} value={gym._id}>
                        {gym.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="equip-inventory-option">
                  <input
                    type="checkbox"
                    id="inInventory"
                    name="inInventory"
                    checked={formData.inInventory}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        inInventory: e.target.checked,
                        gymId: e.target.checked ? "" : formData.gymId,
                      });
                    }}
                  />
                  <label htmlFor="inInventory">
                    Add to inventory without gym
                  </label>
                </div>

                <div className="equip-form-group">
                  <label>Condition *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div className="equip-form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional information about the equipment..."
                    rows="3"
                  ></textarea>
                </div>

                <div className="equip-form-actions">
                  <button
                    type="button"
                    className="equip-btn-cancel"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="equip-btn-save">
                    {selectedEquipment ? "Save Changes" : "Add Equipment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {showMaintenanceModal && selectedEquipment && (
        <div className="equip-modal-overlay">
          <div className="equip-modal">
            <div className="equip-modal-header">
              <h3>
                <FaTools /> Schedule Maintenance
              </h3>
              <button
                className="equip-modal-close"
                onClick={() => setShowMaintenanceModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="equip-modal-content">
              <div className="equipment-info">
                <p>
                  <strong>Equipment:</strong> {selectedEquipment.name}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {selectedEquipment.inInventory ? "Inventory" : "Gym"}
                </p>
                <p>
                  <strong>Current Condition:</strong>{" "}
                  {selectedEquipment.condition}
                </p>
                <p>
                  <strong>Last Maintenance:</strong>{" "}
                  {selectedEquipment.lastMaintenanceDate
                    ? new Date(
                        selectedEquipment.lastMaintenanceDate
                      ).toLocaleDateString()
                    : "No previous maintenance recorded"}
                </p>
              </div>

              <form onSubmit={handleMaintenanceSubmit}>
                <div className="equip-form-group">
                  <label>Scheduled Date *</label>
                  <input
                    type="date"
                    value={maintenanceForm.scheduledDate}
                    onChange={(e) =>
                      setMaintenanceForm((prev) => ({
                        ...prev,
                        scheduledDate: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="equip-form-group">
                  <label>Type</label>
                  <select
                    value={maintenanceForm.type}
                    onChange={(e) =>
                      setMaintenanceForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                  >
                    <option value="Routine">Routine</option>
                    <option value="Repair">Repair</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>

                <div className="equip-form-group">
                  <label>Description *</label>
                  <textarea
                    value={maintenanceForm.description}
                    onChange={(e) =>
                      setMaintenanceForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the maintenance to be performed..."
                    rows="3"
                    required
                  />
                </div>

                <div className="equip-form-group">
                  <label>Status</label>
                  <select
                    value={maintenanceForm.status}
                    onChange={(e) =>
                      setMaintenanceForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="equip-form-actions">
                  <button
                    type="button"
                    className="equip-btn-cancel"
                    onClick={() => setShowMaintenanceModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="equip-btn-save">
                    Schedule
                  </button>
                </div>
              </form>

              {maintenanceHistory.length > 0 && (
                <div className="maintenance-history">
                  <h4>Maintenance History</h4>
                  <div className="maintenance-list">
                    {maintenanceHistory.map((maintenance, index) => (
                      <div
                        key={maintenance._id || index}
                        className="maintenance-item"
                        data-status={maintenance.status || "Scheduled"}
                      >
                        <div className="maintenance-header">
                          <div>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(
                                maintenance.scheduledDate
                              ).toLocaleDateString()}
                            </p>
                            <select
                              value={maintenance.status || "Scheduled"}
                              onChange={(e) =>
                                handleStatusUpdate(
                                  maintenance._id,
                                  e.target.value
                                )
                              }
                              className={`status-select status-${(
                                maintenance.status || "Scheduled"
                              )
                                .toLowerCase()
                                .replace(/\s+/g, "")}`}
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Overdue">Overdue</option>
                            </select>
                          </div>
                          <button
                            onClick={() =>
                              handleMaintenanceDelete(maintenance._id)
                            }
                            className="delete-maintenance-btn"
                            title="Delete maintenance record"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <p>
                          <strong>Description:</strong>{" "}
                          {maintenance.description}
                        </p>
                        {maintenance.completedDate && (
                          <p>
                            <strong>Completed:</strong>{" "}
                            {new Date(
                              maintenance.completedDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                        {maintenance.notes && (
                          <p>
                            <strong>Notes:</strong> {maintenance.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEquipment && (
        <div className="equip-modal-overlay">
          <div className="equip-modal">
            <div className="equip-modal-header">
              <h3>
                <FaExclamationTriangle /> Confirm Delete
              </h3>
              <button
                className="equip-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="equip-modal-content">
              <p>Are you sure you want to delete this equipment?</p>
              <div className="equipment-info">
                <p>
                  <strong>Name:</strong> {selectedEquipment.name}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {selectedEquipment.inInventory
                    ? "Inventory"
                    : selectedEquipment.gymName}
                </p>
                <p>
                  <strong>Condition:</strong> {selectedEquipment.condition}
                </p>
              </div>
              <div className="delete-warning">
                <FaExclamationCircle />
                <span>This action cannot be undone.</span>
              </div>
              <div className="equip-form-actions">
                <button
                  type="button"
                  className="equip-btn-cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="equip-btn-delete"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="equip-modal-overlay">
          <div className="equip-modal equip-reports-modal">
            <div className="equip-modal-header">
              <h3>
                <FaChartBar /> Equipment Reports & Analytics
              </h3>
              <button
                className="equip-modal-close"
                onClick={() => setShowReportsModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="equip-reports-container">
              <div className="equip-report-section">
                <h4>Equipment by Category</h4>
                <div className="equip-chart-placeholder">
                  <p>Chart visualizing equipment distribution by category</p>
                </div>
              </div>

              <div className="equip-report-section">
                <h4>Equipment Condition Status</h4>
                <div className="equip-chart-placeholder">
                  <p>Chart visualizing equipment condition distribution</p>
                </div>
              </div>

              <div className="equip-report-section">
                <h4>Maintenance History</h4>
                <div className="equip-chart-placeholder">
                  <p>Chart visualizing maintenance history over time</p>
                </div>
              </div>
            </div>

            <div className="equip-form-actions">
              <button
                type="button"
                className="equip-btn-close"
                onClick={() => setShowReportsModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="equip-btn-submit"
                onClick={handleReports}
              >
                <FaFileAlt /> Export Report
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default EquipmentManagement;
