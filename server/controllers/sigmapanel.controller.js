// src/controllers/sigmapanel.controller.js
import Sigmapanel from '../models/sigmapanel.model.js';

const populateAll = [
  { path: 'patientID',    select: 'firstname lastname dob sex' },
  { path: 'doctorID',     select: 'firstName lastName'      },
  { path: 'appointmentID', select: 'date time'              }
];

export const listSigmapanels = async (req, res) => {
  try {
    const { appointmentID, patientID } = req.query;

    let query = {};
    if (appointmentID) {
      query.appointmentID = appointmentID;
    } else if (patientID) {
      query.patientID = patientID;
    }

    // if filtering by appointmentID we return one panel (or null)
    if (appointmentID) {
      const panel = await Sigmapanel
        .findOne(query)
        .populate(populateAll);
      return res.json(panel);             // may be null if none found
    }

    // otherwise return an array (possibly filtered by patientID, or all)
    const panels = await Sigmapanel
      .find(query)
      .sort({ visitDateTime: -1 })        // newest first
      .populate(populateAll);

    return res.json(panels);
  } catch (err) {
    console.error('listSigmapanels error:', err);
    return res
      .status(500)
      .json({ error: 'Failed to list sigmapanels' });
  }
};

export const createSigmapanel = async (req, res) => {
  try {
    const panel = new Sigmapanel(req.body);
    await panel.save();

    // return with all populated paths
    const full = await Sigmapanel
      .findById(panel._id)
      .populate(populateAll);

    return res.status(201).json(full);
  } catch (err) {
    console.error('createSigmapanel error:', err);
    return res.status(400).json({ error: err.message });
  }
};

export const updateSigmapanel = async (req, res) => {
  try {
    const updates = { ...req.body };
    const panel = await Sigmapanel
      .findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate(populateAll);

    if (!panel) {
      return res.status(404).json({ error: 'Sigmapanel not found' });
    }

    return res.json(panel);
  } catch (err) {
    console.error('updateSigmapanel error:', err);
    return res.status(400).json({ error: err.message });
  }
};

export const getSigmapanel = async (req, res) => {
  try {
    const panel = await Sigmapanel
      .findById(req.params.id)
      .populate(populateAll);

    if (!panel) {
      return res.status(404).json({ error: 'Sigmapanel not found' });
    }

    return res.json(panel);
  } catch (err) {
    console.error('getSigmapanel error:', err);
    return res.status(400).json({ error: 'Invalid sigmapanel ID' });
  }
};
