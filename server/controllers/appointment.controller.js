// controllers/appointment.controller.js

import Appointment from '../models/appointment.model.js';

// Define which fields to populate for related models (patient, doctor, clinic)
const populateAll = [
  { path: 'patient', select: 'firstname lastname dob sex' },
  { path: 'doctor', select: 'firstName lastName' },
  { path: 'clinic', select: 'name nameaddress' },
];

/**
 * GET /api/appointments
 * Retrieves a list of all appointments with populated patient, doctor, and clinic info.
 */
export const listAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find().populate(populateAll);
    return res.json(appts);
  } catch (err) {
    console.error('listAppointments error:', err);
    return res.status(500).json({ error: 'Failed to list appointments' });
  }
};

/**
 * POST /api/appointments
 * Creates a new appointment and returns the populated result.
 */
export const createAppointment = async (req, res) => {
  try {
    // Destructure fields from request body
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

    // Combine date and time into a single Date object
    const datetime = new Date(`${date}T${time}`);

    // Create a new appointment document
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

    // Save the appointment to the database
    await appt.save();

    // Re-fetch the appointment with related data populated
    const full = await Appointment.findById(appt._id).populate(populateAll);
    return res.status(201).json(full);
  } catch (err) {
    console.error('createAppointment error:', err);
    return res.status(400).json({ error: err.message });
  }
};

/**
 * GET /api/appointments/:appointmentId
 * Retrieves a specific appointment by ID with populated references.
 */
export const getAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Find the appointment by ID and populate referenced data
    const appt = await Appointment.findById(appointmentId).populate(populateAll);

    // If not found, return 404
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    return res.json(appt);
  } catch (err) {
    console.error('getAppointment error:', err);
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }
};

/**
 * PUT /api/appointments/:appointmentId
 * Updates allowed fields for an appointment and returns the updated document.
 */
export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Define which fields are allowed to be updated
    const allowed = [
      'patient',
      'doctor',
      'clinic',
      'purpose',
      'date',
      'time',
      'started',
      'ended',
      'paymentMethod',
      'hmo',
      'status'
    ];

    const updates = {};

    // Only include fields that are present in the request body
    for (let key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // If both date and time are updated, calculate new datetime
    if (updates.date && updates.time) {
      updates.datetime = new Date(`${updates.date}T${updates.time}`);
    }

    // Perform the update and return the new document with populated fields
    const appt = await Appointment.findByIdAndUpdate(
      appointmentId,
      updates,
      { new: true }
    ).populate(populateAll);

    // If appointment not found, return 404
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    return res.json(appt);
  } catch (err) {
    console.error('updateAppointment error:', err);
    return res.status(400).json({
      error: 'Failed to update appointment',
      details: err.message
    });
  }
};
