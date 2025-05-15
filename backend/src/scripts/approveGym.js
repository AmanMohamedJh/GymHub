const mongoose = require('mongoose');
const Gym = require('../models/Gym_Owner/Gym');
require('dotenv').config();

const approveGym = async (gymId) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find and update the gym status to approved
        const gym = await Gym.findByIdAndUpdate(
            gymId,
            { status: 'approved' },
            { new: true }
        );

        if (!gym) {
            console.error('Gym not found');
            process.exit(1);
        }

        console.log('Updated gym:', {
            id: gym._id,
            name: gym.name,
            status: gym.status
        });

        console.log('Gym approved successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error approving gym:', error);
        process.exit(1);
    }
};

// Get gym ID from command line argument
const gymId = process.argv[2];
if (!gymId) {
    console.error('Please provide a gym ID as argument');
    process.exit(1);
}

approveGym(gymId);
