import React, { useState } from "react";
import {
  FaSave,
  FaTimes,
  FaTools,
  FaCalendarAlt,
  FaTrash,
  FaExclamationTriangle,
  FaChartBar,
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import "./Styles/EquipmentManagement.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const EquipmentManagement = () => {
  // State variables for modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    condition: "",
    notes: "",
  });

  // State for maintenance data
  const [maintenanceData, setMaintenanceData] = useState({
    scheduledDate: new Date(),
    description: "",
    status: "Scheduled",
  });

  // State for filter and search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Sample equipment data
  const [equipmentList, setEquipmentList] = useState([
    {
      id: 1,
      name: "Treadmill",
      location: "Cardio Zone",
      condition: "Excellent",
      lastMaintenance: "2023-10-15",
      category: "Cardio",
      gymLocation: "Main Floor",
      notes: "Regular maintenance performed monthly",
    },
    {
      id: 2,
      name: "Bench Press",
      location: "Strength Area",
      condition: "Good",
      lastMaintenance: "2023-09-12",
      category: "Strength",
      gymLocation: "Weight Room",
      notes: "Some wear on padding",
    },
    {
      id: 3,
      name: "Dumbbells (Set)",
      location: "Free Weights",
      condition: "Fair",
      lastMaintenance: "2023-08-30",
      category: "Weights",
      gymLocation: "Main Floor",
      notes: "Some rust on 15kg and 20kg weights",
    },
    {
      id: 4,
      name: "Elliptical Machine",
      location: "Cardio Zone",
      condition: "Poor",
      lastMaintenance: "2023-07-22",
      category: "Cardio",
      gymLocation: "Main Floor",
      notes: "Display needs replacement",
    },
    {
      id: 5,
      name: "Rowing Machine",
      location: "Cardio Zone",
      condition: "Excellent",
      lastMaintenance: "2023-10-05",
      category: "Cardio",
      gymLocation: "Main Floor",
      notes: "",
    },
  ]);

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMaintenanceDateChange = (date) => {
    setMaintenanceData({ ...maintenanceData, scheduledDate: date });
  };

  const handleMaintenanceInputChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceData({ ...maintenanceData, [name]: value });
  };

  const handleEditClick = (equipment) => {
    setSelectedEquipment(equipment);
    setFormData({
      name: equipment.name,
      location: equipment.location,
      condition: equipment.condition,
      notes: equipment.notes || "",
    });
    setShowEditModal(true);
  };

  const handleMaintenanceClick = (equipment) => {
    setSelectedEquipment(equipment);
    setShowMaintenanceModal(true);
  };

  const handleDeleteClick = (equipment) => {
    setSelectedEquipment(equipment);
    setShowDeleteModal(true);
  };

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    // Handle maintenance submission logic here
    // After submission:
    setShowMaintenanceModal(false);
  };

  const handleDelete = () => {
    // Delete equipment logic here
    setEquipmentList(
      equipmentList.filter((item) => item.id !== selectedEquipment.id)
    );
    setShowDeleteModal(false);
  };

  const handleAddNewClick = () => {
    setSelectedEquipment(null);
    setFormData({
      name: "",
      location: "",
      condition: "Good",
      notes: "",
    });
    setShowEditModal(true);
  };

  const handleReports = () => {
    setShowReportsModal(true);
  };

  // Filter and sort functions
  const getFilteredEquipment = () => {
    return equipmentList
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCondition =
          filterCondition === "all" ||
          item.condition.toLowerCase() === filterCondition.toLowerCase();
        return matchesSearch && matchesCondition;
      })
      .sort((a, b) => {
        if (sortDirection === "asc") {
          return a[sortField].localeCompare(b[sortField]);
        } else {
          return b[sortField].localeCompare(a[sortField]);
        }
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

  const filteredEquipment = getFilteredEquipment();

  return (
    <div className="equipment-management">
      {/* Top Header Section */}
      <div className="equip-header">
        <h2>
          <FaTools /> Equipment Management
        </h2>
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
              <th onClick={() => handleSortChange("location")}>
                Location
                {sortField === "location" &&
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
              filteredEquipment.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.location}</td>
                  <td>
                    <span
                      className={`equip-condition equip-condition-${item.condition.toLowerCase()}`}
                    >
                      {item.condition}
                    </span>
                  </td>
                  <td>{item.lastMaintenance || "Not recorded"}</td>
                  <td className="equip-actions">
                    <button
                      className="equip-btn-icon equip-btn-edit"
                      onClick={() => handleEditClick(item)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="equip-btn-icon equip-btn-maintenance"
                      onClick={() => handleMaintenanceClick(item)}
                    >
                      <FaTools />
                    </button>
                    <button
                      className="equip-btn-icon equip-btn-delete"
                      onClick={() => handleDeleteClick(item)}
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

      {/* Edit/Add Modal */}
      {showEditModal && (
        <div className="equip-modal-overlay">
          <div className="equip-modal equip-edit-modal">
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

            <form onSubmit={(e) => e.preventDefault()} className="equip-form">
              <div className="equip-form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter equipment name"
                  required
                />
              </div>

              <div className="equip-form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter equipment location"
                  required
                />
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
                <button type="submit" className="equip-btn-submit">
                  <FaSave />{" "}
                  {selectedEquipment ? "Update Equipment" : "Add Equipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {showMaintenanceModal && selectedEquipment && (
        <div className="equip-modal-overlay">
          <div className="equip-modal equip-maintenance-modal">
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

            <div className="equip-maintenance-details">
              <div className="equip-maintenance-item">
                <span className="equip-maintenance-label">Equipment:</span>
                <span className="equip-maintenance-value">
                  {selectedEquipment.name}
                </span>
              </div>
              <div className="equip-maintenance-item">
                <span className="equip-maintenance-label">Location:</span>
                <span className="equip-maintenance-value">
                  {selectedEquipment.gymLocation}
                </span>
              </div>
              <div className="equip-maintenance-item">
                <span className="equip-maintenance-label">
                  Current Condition:
                </span>
                <span
                  className={`equip-condition equip-condition-${selectedEquipment.condition
                    .toLowerCase()
                    .replace(/\s+/g, "")}`}
                >
                  {selectedEquipment.condition}
                </span>
              </div>
              <div className="equip-maintenance-item">
                <span className="equip-maintenance-label">
                  Last Maintenance:
                </span>
                <span className="equip-maintenance-value">
                  {selectedEquipment.lastMaintenance ||
                    "No previous maintenance recorded"}
                </span>
              </div>
            </div>

            <form onSubmit={handleMaintenanceSubmit} className="equip-form">
              <div className="equip-form-group">
                <label>Scheduled Date *</label>
                <input
                  type="date"
                  name="scheduledDate"
                  onChange={(e) =>
                    setMaintenanceData({
                      ...maintenanceData,
                      scheduledDate: new Date(e.target.value),
                    })
                  }
                  className="equip-date-input"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="equip-form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={maintenanceData.description}
                  onChange={handleMaintenanceInputChange}
                  placeholder="Describe the maintenance to be performed..."
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="equip-form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={maintenanceData.status}
                  onChange={handleMaintenanceInputChange}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
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
                <button type="submit" className="equip-btn-submit">
                  <FaCalendarAlt /> Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEquipment && (
        <div className="equip-modal-overlay">
          <div className="equip-modal equip-delete-modal">
            <div className="equip-modal-header">
              <h3>
                <FaTrash /> Retire Equipment
              </h3>
              <button
                className="equip-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="equip-delete-content">
              <div className="equip-delete-warning">
                <FaExclamationTriangle />
                <p>
                  Are you sure you want to retire{" "}
                  <strong>{selectedEquipment.name}</strong>?
                </p>
              </div>
              <p className="equip-delete-note">
                This will mark the equipment as inactive. The equipment record
                will be maintained for historical purposes but will no longer
                appear in active inventory.
              </p>
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
                <FaTrash /> Retire Equipment
              </button>
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
    </div>
  );
};

export default EquipmentManagement;
