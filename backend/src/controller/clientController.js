
const mongoose = require("mongoose");
const Client = require("../models/clientModel");


const newClient = Client({
    userId: null,
    name: null,
    fitness: {
        weight: null,
        height: null,
        bmi: null,
        workoutLogs: [],
        fitnessGoals: [],

    },
    membership: {
        plan: null,
        startDate: null,
        isActive: true,
        payments: [],

    },

    bio: {
        DOB: null,
        gender: null,
        address: null,
        medicalCondition: [],
    },
    gymActivities: {
        checkIns: null,
        classBookings: null,

    }
});

const addWorkoutLog = async (req, res) => {
    const { id, name, workoutData } = req.body;

    try {
        const clientData = await Client.findOne({ userId: id });
        if (clientData) {
            clientData.fitness.workoutLogs.push(workoutData);
            const c = await clientData.save();
            if (!c) {
                return res.status(400).json("not saved in existing user");
            }
        } else {

            newClient.userId = id;
            newClient.name = name;
            newClient.fitness.workoutLogs.push(workoutData);

            console.log("thiss place");
            await newClient.save();
            res.status(200).json("client details created successfully");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateBMI = async (req, res) => {
    const { id, formData } = req.body;
    try {
        if (clientData) {
            clientData.fitness.height = formData.height;
            clientData.fitness.weight = formData.weight;
            clientData.fitness.bmi = formData.bmi;
            await clientData.save();
            return res.status(200).json(" saved in existing user");
        } else {
            newClient.userId = id;
            newClient.fitness.height = formData.height;
            newClient.fitness.weight = formData.weight;
            newClient.fitness.bmi = formData.bmi;
            await clientData.save();
            return res.status(200).json(" saved in new user");
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    addWorkoutLog,
    updateBMI
}

