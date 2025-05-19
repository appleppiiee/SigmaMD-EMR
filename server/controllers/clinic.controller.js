import Clinic from '../models/clinic.model.js';

/**
 * List all clinics (no admin filter)
 */
export const listClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find()
      .populate('doctorIDs', 'firstName lastName')
      .populate('secretaryIDs', 'firstName lastName')
      .select('-__v');
    res.json(clinics);
  } catch (err) {
    console.error('Error fetching clinics:', err);
    res.status(500).json({ error: 'Failed to fetch clinics' });
  }
};

/**
 * Create a new clinic
 */
export const createClinic = async (req, res) => {
  try {
    const clinic = new Clinic(req.body);
    await clinic.save();
    const populated = await clinic
      .populate('doctorIDs', 'firstName lastName')
      .populate('secretaryIDs', 'firstName lastName')
      .execPopulate();
    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creating clinic:', err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Update an existing clinic by ID
 */
export const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const clinic = await Clinic.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('doctorIDs', 'firstName lastName')
      .populate('secretaryIDs', 'firstName lastName');

    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }
    res.json(clinic);
  } catch (err) {
    console.error('Error updating clinic:', err);
    res.status(400).json({ error: err.message });
  }
};

