const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  fitness: {
    weight: { type: String },
    height: { type: String },
    bmi: [
      {
        bmi: { type: Number },
        date: { type: Date },
      },
    ],
    workoutLogs: [
      {
        date: { type: Date },
        workout: { type: String },
        exercises: [
          {
            exercise: { type: String },
            sets: { type: Number },
            reps: { type: Number },
            weight: { type: String },
          },
        ],
      },
    ],
    fitnessGoals: [
      {
        goal: { type: String },
        description: { type: String },
        deadline: { type: Date },
        progress: { type: Number },
        status: { type: String },
      },
    ],
  },
  bio: {
    DOB: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    medicalCondition: [{ type: String }],
    fitnessLevel: { type: String, required: true },
    emContactPerson: { type: String, required: true },
    emContactRelation: { type: String, required: true },
    emContactNumber: { type: String, required: true },
    joinedIn: { type: Date, required: true },
  },
  gymActivity: {
    checkIns: { type: Number, default: 0 },
    classBookings: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
    required: true,
  },
});

module.exports = mongoose.model("Client", clientSchema);
