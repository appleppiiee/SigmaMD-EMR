// src/controllers/sigmapanel.controller.js
import Sigmapanel from '../models/sigmapanel.model.js';

const populateAll = [
  { path: 'patientID',    select: 'firstname lastname dob sex' },
  { path: 'doctorID',     select: 'firstName lastName'      },
  { path: 'appointmentID', select: 'date time'              }
];

export const listSigmapanels = async (req, res) => {
  try {
    if (req.query.appointmentID) {
      // findOne by appointmentID
      const panel = await Sigmapanel
        .findOne({ appointmentID: req.query.appointmentID })
        .populate(populateAll);
      return res.json(panel);
    }
    const panels = await Sigmapanel.find().populate(populateAll);
    res.json(panels);
  } catch (err) {
    console.error('listSigmapanels error:', err);
    res.status(500).json({ error: 'Failed to list sigma panels' });
  }
};

export const createSigmapanel = async (req, res) => {
  try {
    const panel = new Sigmapanel(req.body);
    await panel.save();
    const full = await Sigmapanel.findById(panel._id).populate(populateAll);
    res.status(201).json(full);
  } catch (err) {
    console.error('createSigmapanel error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const updateSigmapanel = async (req, res) => {
  try {
    const updates = { ...req.body };
    const panel = await Sigmapanel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate(populateAll);
    if (!panel) return res.status(404).json({ error: 'Sigma panel not found' });
    res.json(panel);
  } catch (err) {
    console.error('updateSigmapanel error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const getSigmapanel = async (req, res) => {
  try {
    const panel = await Sigmapanel
      .findById(req.params.id)
      .populate(populateAll);
    if (!panel) return res.status(404).json({ error: 'Sigma panel not found' });
    res.json(panel);
  } catch (err) {
    console.error('getSigmapanel error:', err);
    res.status(400).json({ error: 'Invalid sigma panel ID' });
  }
};
