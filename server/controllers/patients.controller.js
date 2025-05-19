import Patient from '../models/patient.model.js';

export const listPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    console.error(" Failed to fetch patients:", err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export const createPatient = async (req, res) => {
  try {
    console.log(" Incoming patient:", req.body);
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.warn(" Failed to create patient:", err);
    res.status(500).json({ error: 'Failed to create patient' });
  }
};

export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get patient' });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update patient' });
  }
};
