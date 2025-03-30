const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      default: null, // null means it's in inventory
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Owner of the equipment
    },
    condition: {
      type: String,
      required: true,
      enum: ["Excellent", "Good", "Fair", "Poor"],
    },
    notes: {
      type: String,
      default: "",
    },
    inInventory: {
      type: Boolean,
      default: true, // true means not assigned to any gym
    },
    maintenance: [
      {
        scheduledDate: {
          type: Date,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["Scheduled", "In Progress", "Completed", "Overdue"],
          default: "Scheduled",
        },
        completedDate: {
          type: Date,
        },
        notes: String,
        notificationSent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    lastMaintenanceDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for querying maintenance schedules
equipmentSchema.index({ "maintenance.scheduledDate": 1 });

// Method to check and update maintenance status
equipmentSchema.methods.updateMaintenanceStatus = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  this.maintenance.forEach((maintenance) => {
    const scheduledDate = new Date(maintenance.scheduledDate);
    scheduledDate.setHours(0, 0, 0, 0);

    // If scheduled date is today and status is still 'Scheduled'
    if (
      scheduledDate.getTime() === today.getTime() &&
      maintenance.status === "Scheduled"
    ) {
      maintenance.status = "In Progress";
    }
    // If scheduled date is past and status is not 'Completed'
    else if (scheduledDate < today && maintenance.status !== "Completed") {
      maintenance.status = "Overdue";
    }
  });

  return this.save();
};

module.exports = mongoose.model("Equipment", equipmentSchema);
