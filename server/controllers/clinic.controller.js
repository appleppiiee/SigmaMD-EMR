import Clinic from '../models/clinic.model.js';

// List all clinics
export const listClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find().select('name nameaddress address phone mobileNo remarks providerID adminID status createdAt updatedAt');
    res.json(clinics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clinics' });
  }
};

// Create a new clinic
export const createClinic = async (req, res) => {
  try {
    const clinic = new Clinic(req.body);
    await clinic.save();
    res.status(201).json(clinic);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create clinic', details: err.message });
  }
};

// Delete clinic by ID
export const deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }

    await clinic.deleteOne();
    res.json({ message: 'Clinic removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove clinic' });
  }
};
