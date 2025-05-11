const ClientTrainerSessions = require('../../models/Client/ClientTrainerSessions');
const User = require('../../models/userModel');

// POST /api/clientTrainerSessions/join
exports.joinSession = async (req, res) => {
  try {
    const { sessionBookingId, phoneNumber, emergencyContact, preferredCommunication, fitnessGoals } = req.body;
    const clientId = req.user._id;
    const clientName = req.body.clientName;
    const clientEmail = req.body.clientEmail;

    // Check if already joined
    const existing = await ClientTrainerSessions.findOne({ sessionBookingId, clientId, status: 'joined' });
    if (existing) {
      return res.status(400).json({ error: 'Already joined this session.' });
    }

    const newBooking = new ClientTrainerSessions({
      sessionBookingId,
      clientId,
      clientName,
      clientEmail,
      phoneNumber,
      emergencyContact,
      preferredCommunication,
      fitnessGoals,

      status: 'joined',
    });
    await newBooking.save();
    res.status(201).json({ message: 'Session joined successfully.', booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/clientTrainerSessions/:sessionBookingId
exports.getSessionBookings = async (req, res) => {
  try {
    const { sessionBookingId } = req.params;
    const bookings = await ClientTrainerSessions.find({ sessionBookingId, status: 'joined' });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/clientTrainerSessions/client/:clientId
exports.getClientSessions = async (req, res) => {
  try {
    const { clientId } = req.params;
    // Only sessions with status 'joined'
    const bookings = await ClientTrainerSessions.find({ clientId, status: 'joined' });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/clientTrainerSessions/client/:clientId/full
exports.getClientJoinedTrainerSessions = async (req, res) => {
  try {
    const { clientId } = req.params;
    // Only sessions with status 'joined'
    const bookings = await ClientTrainerSessions.find({ clientId, status: 'joined' });
    const TrainerSession = require('../../models/Trainer/TrainerSession');
    const User = require('../../models/userModel');
    // Populate each with real TrainerSession data and trainer name
    const populated = await Promise.all(
      bookings.map(async (b) => {
        let session = await TrainerSession.findById(b.sessionBookingId);
        let trainerName = 'Trainer';
        if (session && session.user) {
          const trainer = await User.findById(session.user);
          if (trainer && trainer.name) trainerName = trainer.name;
        }
        session = session ? { ...session.toObject(), trainerName } : null;
        return { ...b.toObject(), trainerSession: session };
      })
    );
    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/clientTrainerSessions/cancel/:id
exports.cancelSession = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await ClientTrainerSessions.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.status(200).json({ message: 'Session deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
