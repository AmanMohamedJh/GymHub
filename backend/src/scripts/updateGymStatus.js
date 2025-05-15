const mongoose = require('mongoose');
const Gym = require('../models/Gym_Owner/Gym');
require('dotenv').config();

const updateGymStatus = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all gyms without a status field or with null/undefined status
        const gyms = await Gym.find({
            $or: [
                { status: { $exists: false } },
                { status: null },
                { status: '' }
            ]
        });

        console.log(`Found ${gyms.length} gyms without status`);

        // Update each gym to have 'pending' status
        for (const gym of gyms) {
            gym.status = 'pending';
            await gym.save();
            console.log(`Updated gym ${gym._id} with status: pending`);
        }

        console.log('All gyms updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating gyms:', error);
        process.exit(1);
    }
};

updateGymStatus();
