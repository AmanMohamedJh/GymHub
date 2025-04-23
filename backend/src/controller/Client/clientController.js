const mongoose = require("mongoose");
const Client = require("../../models/Client/clientModel");

// --- New Client Data ---
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
  },
});

// --- Add Workout Log ---
const addWorkoutLog = async (req, res) => {
  const { id, name, workoutData } = req.body;

  console.log(req.body);
  try {
    const clientData = await Client.findOneAndUpdate(
      { userId: id },
      {
        $push: {
          "fitness.workoutLogs": {
            $each: [
              {
                date: workoutData.date,
                workout: workoutData.workout,
                exercises: workoutData.exercises,
              },
            ],
            $slice: -3,
          },
        },
      },
      { new: true, upsert: true }
    );
    await clientData.save();
    return res.status(200).json(" saved in existing user");
    if (!clientData) {
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
        },
      });

      newClient.userId = id;

      if (!newClient.fitness.workoutLogs) {
        newClient.fitness.workoutLogs = [];
      }

      newClient.fitness.workoutLogs.push({
        workoutLogs: workoutData,
        date: workoutData.date,
        exercises: workoutData.exercises,
      });
      await newClient.save();
      return res.status(200).json(" saved in new user");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- Update BMI ---
const updateBMI = async (req, res) => {
  const { id, formData } = req.body;

  console.log(req.body);
  try {
    const clientData = await Client.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          "fitness.height": formData.height,
          "fitness.weight": formData.weight,
        },
        $push: {
          "fitness.bmi": {
            $each: [{ bmi: formData.bmi, date: formData.date }],
            $slice: -3,
          },
        },
      },
      { new: true, upsert: true }
    );
    await clientData.save();
    return res.status(200).json(" saved in existing user");
    if (!clientData) {
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
        },
      });

      newClient.userId = id;
      newClient.fitness.height = formData.height;
      newClient.fitness.weight = formData.weight;

      if (!newClient.fitness.bmi) {
        newClient.fitness.bmi = [];
      }

      newClient.fitness.bmi.push({
        bmi: formData.bmi,
        date: formData.date,
      });
      await newClient.save();
      return res.status(200).json(" saved in new user");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- Add Fitness Goal ---
const addFitnessGoal = async (req, res) => {
  const { id, formData } = req.body;
  try {
    const client = await Client.findOne({ userId: id });
    console.log("g IDD:", formData.goalId);

    if (client) {
      console.log("g IDD:", formData.goalId);
      const existingGoalIndex = client.fitness.fitnessGoals.findIndex(
        (goal) => goal._id.toString() === formData.goalId
      );
      console.log("index", existingGoalIndex);
      if (existingGoalIndex !== -1) {
        client.fitness.fitnessGoals[existingGoalIndex] = {
          ...client.fitness.fitnessGoals[existingGoalIndex],
          ...formData,
        };
        await client.save();
        console.log("Goal updated.");

        return res.status(200).json(" saved in new user");
      } else {
        client.fitness.fitnessGoals.push(formData);
        await client.save();
        console.log("Goal added.");

        return res.status(200).json(" saved in new user");
      }
    } else {
      newClient.userId = id;
      newClient.fitness.fitnessGoals.push(formData);

      await newClient.save();
      console.log("New client created with goal.");
    }
  } catch (err) {
    console.error("Error handling client and goal:", err);
  }
};

// --- Get Fitness Data ---
const getFitnessData = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid id" });
    }
    const client = await Client.findOne({ userId: id });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client.fitness);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- Contact Client by Email ---
const nodemailer = require("nodemailer");

const contactClientByEmail = async (req, res) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // You may reuse your transporter config here, or define a new one if needed
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent to client successfully." });
  } catch (error) {
    console.error("Client contact email error:", error);
    res.status(500).json({ error: "Failed to send email to client." });
  }
};

module.exports = {
  addWorkoutLog,
  updateBMI,
  addFitnessGoal,
  getFitnessData,
  contactClientByEmail,
};
