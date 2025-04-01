const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({

    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    fitness: {
        weight: { type: String },
        height: { type: String },
        bmi: [{
            bmi: { type: Number },
            date: { type: Date },
        }],
        workoutLogs: [{
            date: { type: Date },
            workout: { type: String },
            exercises: [{
                exercise: { type: String },
                sets: { type: Number },
                reps: { type: Number },
                weight: { type: String },
            }]

        }],
        fitnessGoals: [{
            goal: { type: String },
            description: { type: String },
            deadline: { type: Date },
            progress: { type: Number },
            status: { type: String },
        }
        ],
    },

    membership: {
        plan: { type: String },
        startDate: { type: Date },
        isActive: { type: Boolean },
        payments: [
            {
                date: { type: Date },
                amount: { type: Number },
                status: { type: String },
            }
        ]
    },

    bio: {
        DOB: { type: Date },
        gender: { type: String },
        address: { type: String },
        medicalCondition: [{ type: String }],

    },
    gymActivity: {
        checkIns: { type: Number },
        classBookings: { type: Number }
    },


});

module.exports = mongoose.model("Client", clientSchema);