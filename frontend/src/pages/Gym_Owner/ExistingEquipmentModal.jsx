import React from "react";
import { FaBoxOpen, FaTimes } from "react-icons/fa";
import "./Styles/EquipmentManagement.css";

const ExistingEquipmentModal = ({
  show,
  onClose,
  equipmentList,
  onAddToGym,
  targetGymName,
}) => {
  if (!show) return null;

  const inventoryEquipment = equipmentList
    ? equipmentList.filter((item) => !item.gymName)
    : [];
  const isLoading = !equipmentList;

  return (
    <div className="equip-modal-overlay">
      <div className="equip-modal equip-existing-modal">
        <div className="equip-modal-header">
          <h3>
            <FaBoxOpen /> Add Existing Equipment
          </h3>
          <button className="equip-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="equip-modal-content">
          {isLoading ? (
            <p className="loading-message">Loading equipment...</p>
          ) : inventoryEquipment.length === 0 ? (
            <p className="no-equipment">No equipment available in inventory</p>
          ) : (
            <div className="equipment-grid">
              {inventoryEquipment.map((equipment) => (
                <div key={equipment._id} className="equipment-card">
                  <h4>{equipment.name}</h4>
                  <p>
                    Condition:{" "}
                    <span
                      className={`condition-${equipment.condition.toLowerCase()}`}
                    >
                      {equipment.condition}
                    </span>
                  </p>
                  <button
                    className="add-to-gym-btn"
                    onClick={() => onAddToGym(equipment._id)}
                  >
                    Add to {targetGymName || "Gym"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExistingEquipmentModal;
