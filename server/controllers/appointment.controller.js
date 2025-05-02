// controllers/appointment.controller.js
import Appointment from '../models/appointment.model.js';

const populateAll = [
  { path: 'patient', select: 'firstname lastname dob sex' },
  { path: 'doctor',  select: 'firstName lastName' },
  { path: 'clinic',  select: 'name nameaddress' },
];

// GET /api/appointments
export const listAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find()
      .populate(populateAll);
    return res.json(appts);
  } catch (err) {
    console.error('listAppointments error:', err);
    return res.status(500).json({ error: 'Failed to list appointments' });
  }
};

// POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      clinic,
      date,
      time,
      purpose,
      paymentMethod,
      hmo
    } = req.body;

    const datetime = new Date(`${date}T${time}`);

    const appt = new Appointment({
      patient,
      doctor,
      clinic,
      date,
      time,
      datetime,
      purpose,
      paymentMethod,
      hmo
    });

    await appt.save();

    // re‐fetch & populate
    const full = await Appointment.findById(appt._id).populate(populateAll);
    return res.status(201).json(full);
  } catch (err) {
    console.error('createAppointment error:', err);
    return res.status(400).json({ error: err.message });
  }
};

// GET /api/appointments/:appointmentId
export const getAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appt = await Appointment.findById(appointmentId).populate(populateAll);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    return res.json(appt);
  } catch (err) {
    console.error('getAppointment error:', err);
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }
};

// PUT /api/appointments/:appointmentId
export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const allowed = ['patient','doctor','clinic','purpose','date','time','started','ended','paymentMethod','hmo','status'];
    const updates = {};
    for (let key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.date && updates.time) {
      updates.datetime = new Date(`${updates.date}T${updates.time}`);
    }

    const appt = await Appointment.findByIdAndUpdate(
      appointmentId,
      updates,
      { new: true }
    ).populate(populateAll);

    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    return res.json(appt);
  } catch (err) {
    console.error('updateAppointment error:', err);
    return res.status(400).json({ error: 'Failed to update appointment', details: err.message });
  }
};
