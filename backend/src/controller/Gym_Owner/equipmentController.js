const Equipment = require('../../models/Gym_Owner/Equipment');
const Gym = require('../../models/Gym_Owner/Gym');
const mongoose = require('mongoose');

// Get owner's approved gyms for dropdown
const getOwnerGyms = async (req, res) => {
    try {
        const gyms = await Gym.find({ 
            ownerId: req.user._id,
            status: 'approved'
        }).select('_id name');
        
        res.status(200).json(gyms);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get inventory equipment (not assigned to any gym)
const getInventoryEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({
            userId: req.user._id,
            inInventory: true,
            gymId: null
        });
        res.status(200).json(equipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add new equipment
const addEquipment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, gymId, condition, notes } = req.body;

        // Create equipment
        const equipmentData = {
            name,
            condition,
            notes,
            userId: req.user._id,
            inInventory: !gymId, // If gymId is provided, it's not in inventory
            gymId: null // Default to null
        };

        // If gymId is provided, verify it's an approved gym owned by the user
        if (gymId) {
            const gym = await Gym.findOne({ 
                _id: gymId, 
                ownerId: req.user._id,
                status: 'approved'
            });
            
            if (!gym) {
                throw new Error('Gym not found or not approved');
            }

            // Update equipment data with gym info
            equipmentData.gymId = gym._id;
            equipmentData.gymName = gym.name;
            equipmentData.inInventory = false;

            // Add equipment to gym's equipment array
            await Gym.findByIdAndUpdate(
                gym._id,
                { $push: { equipment: equipmentData._id } },
                { session }
            );
        }

        // Create the equipment
        const equipment = await Equipment.create([equipmentData], { session });
        
        await session.commitTransaction();
        res.status(201).json(equipment[0]);
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};

// Assign equipment to gym
const assignEquipmentToGym = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { equipmentId, gymId } = req.body;

        // Verify gym exists and is approved
        const gym = await Gym.findOne({ 
            _id: gymId,
            ownerId: req.user._id,
            status: 'approved'
        });

        if (!gym) {
            throw new Error('Gym not found or not approved');
        }

        // Update equipment
        const equipment = await Equipment.findOneAndUpdate(
            { 
                _id: equipmentId,
                userId: req.user._id,
                inInventory: true // Must be in inventory
            },
            { 
                $set: {
                    gymId: gym._id,
                    gymName: gym.name,
                    inInventory: false
                }
            },
            { 
                new: true,
                session
            }
        );

        if (!equipment) {
            throw new Error('Equipment not found or not available');
        }

        // Add equipment to gym
        await Gym.findByIdAndUpdate(
            gym._id,
            { $addToSet: { equipment: equipment._id } },
            { session }
        );

        await session.commitTransaction();
        res.status(200).json(equipment);
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};

// Get all equipment for a gym owner
const getOwnerEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({ userId: req.user._id })
            .populate('gymId', 'name');
        res.status(200).json(equipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get equipment for a specific gym
const getGymEquipment = async (req, res) => {
    try {
        const { gymId } = req.params;
        
        // Verify gym belongs to user
        const gym = await Gym.findOne({ 
            _id: gymId, 
            ownerId: req.user._id 
        });
        
        if (!gym) {
            return res.status(404).json({ error: 'Gym not found or unauthorized' });
        }

        const equipment = await Equipment.find({ 
            gymId,
            userId: req.user._id 
        });
        res.status(200).json(equipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update equipment
const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, gymId, condition, notes, inInventory } = req.body;

        // Verify equipment belongs to user
        const equipment = await Equipment.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found or unauthorized' });
        }

        // If assigning to a gym, verify gym belongs to user
        if (gymId && !inInventory) {
            const gym = await Gym.findOne({ 
                _id: gymId, 
                ownerId: req.user._id 
            });
            
            if (!gym) {
                return res.status(404).json({ error: 'Gym not found or unauthorized' });
            }
        }

        const updatedEquipment = await Equipment.findByIdAndUpdate(
            id,
            { 
                name, 
                gymId: inInventory ? null : gymId, 
                condition, 
                notes,
                inInventory 
            },
            { new: true }
        );

        res.status(200).json(updatedEquipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete equipment
const deleteEquipment = async (req, res) => {
    const { id } = req.params;

    try {
        const equipment = await Equipment.findOneAndDelete({ _id: id, userId: req.user._id });
        
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        res.status(200).json({ message: 'Equipment deleted successfully' });
    } catch (error) {
        console.error('Delete equipment error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Schedule maintenance for equipment
const scheduleMaintenance = async (req, res) => {
    const { equipmentId } = req.params;
    const { scheduledDate, type, description, status } = req.body;

    try {
        const equipment = await Equipment.findOne({ _id: equipmentId, userId: req.user._id });
        
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const newMaintenance = {
            scheduledDate,
            type: type || 'Routine',
            description,
            status: status || 'Scheduled'
        };

        equipment.maintenance.push(newMaintenance);
        await equipment.save();
        
        // Return just the newly added maintenance record
        const addedMaintenance = equipment.maintenance[equipment.maintenance.length - 1];
        res.status(201).json(addedMaintenance);
    } catch (error) {
        console.error('Schedule maintenance error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete maintenance record
const deleteMaintenance = async (req, res) => {
    const { id, maintenanceId } = req.params;

    try {
        const equipment = await Equipment.findOne({ _id: id, userId: req.user._id });
        
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        // Find and remove the maintenance record
        const maintenanceIndex = equipment.maintenance.findIndex(
            m => m._id.toString() === maintenanceId
        );

        if (maintenanceIndex === -1) {
            return res.status(404).json({ error: 'Maintenance record not found' });
        }

        // Remove the maintenance record
        equipment.maintenance.splice(maintenanceIndex, 1);

        // Update lastMaintenanceDate to the most recent completed maintenance
        const lastCompleted = equipment.maintenance
            .filter(m => m.status === 'Completed')
            .sort((a, b) => b.completedDate - a.completedDate)[0];

        equipment.lastMaintenanceDate = lastCompleted ? lastCompleted.completedDate : null;

        await equipment.save();
        
        res.status(200).json(equipment);
    } catch (error) {
        console.error('Delete maintenance error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Update maintenance status
const updateMaintenanceStatus = async (req, res) => {
    const { equipmentId, maintenanceId } = req.params;
    const { status, notes } = req.body;

    try {
        const equipment = await Equipment.findOne({ _id: equipmentId, userId: req.user._id });
        
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const maintenance = equipment.maintenance.id(maintenanceId);
        if (!maintenance) {
            return res.status(404).json({ error: 'Maintenance record not found' });
        }

        // Update maintenance record
        maintenance.status = status;
        if (notes) maintenance.notes = notes;
        
        // If status is changed to completed
        if (status === 'Completed') {
            const now = new Date();
            maintenance.completedDate = now;
            equipment.lastMaintenanceDate = now; // Update equipment's last maintenance date
            maintenance.notificationSent = true; // Stop notifications once completed
        }

        // Save the changes
        await equipment.save();

        // Return just the updated maintenance record
        res.status(200).json(maintenance);
    } catch (error) {
        console.error('Update maintenance status error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Get maintenance history for equipment
const getMaintenanceHistory = async (req, res) => {
    const { equipmentId } = req.params;

    try {
        const equipment = await Equipment.findOne({ _id: equipmentId, userId: req.user._id });
        
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        res.status(200).json(equipment.maintenance || []);
    } catch (error) {
        console.error('Get maintenance history error:', error);
        res.status(400).json({ error: error.message });
    }
};

// Check for due maintenance
const checkDueMaintenance = async (req, res) => {
    try {
        const equipment = await Equipment.find({ userId: req.user._id });
        
        const updatedEquipment = await Promise.all(
            equipment.map(async (item) => {
                await item.updateMaintenanceStatus();
                return item;
            })
        );

        const dueMaintenance = updatedEquipment.flatMap(item => 
            item.maintenance.filter(m => 
                m.status === 'In Progress' && !m.notificationSent
            ).map(m => ({
                equipmentName: item.name,
                equipmentId: item._id,
                maintenanceId: m._id,
                scheduledDate: m.scheduledDate,
                description: m.description
            }))
        );

        res.status(200).json(dueMaintenance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addEquipment,
    getOwnerEquipment,
    getInventoryEquipment,
    getOwnerGyms,
    assignEquipmentToGym,
    getGymEquipment,
    updateEquipment,
    deleteEquipment,
    scheduleMaintenance,
    deleteMaintenance,
    updateMaintenanceStatus,
    getMaintenanceHistory,
    checkDueMaintenance
};
