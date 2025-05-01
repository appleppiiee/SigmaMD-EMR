import Sigmapanel from '../models/sigmapanel.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

const create = async (req, res) => {
  try {
    console.log("Creating sigmapanel with:", req.body);
    const sigmapanel = new Sigmapanel(req.body);
    await sigmapanel.save();
    return res.status(200).json({
      message: "Successfully Created!"
    });
  } catch (err) {
    console.error("Create error:", err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const list = async (req, res) => {
  try {
    let sigmapanels = await Sigmapanel.find()
      .select('patientID appointmentID doctorID visitDateTime vHeight vWeight vBmi vTemp vBloodPressure vPulseRate mhMedicalHistory mhFamilyHistory mhSocialHistory mhAllergies mhCurrentMedications diagnosis plMedication plReferrals plFollowup plProcedures notes createdAt updatedAt status')
      .populate('patientID', 'firstname lastname')
      .populate('doctorID', 'firstName lastName')
      .populate('appointmentID', 'datetime');
    res.json(sigmapanels);
  } catch (err) {
    console.error("List error:", err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const sigmapanelByID = async (req, res, next, id) => {
  try {
    let sigmapanel = await Sigmapanel.findById(id)
      .populate('patientID')
      .populate('doctorID')
      .populate('appointmentID');
    if (!sigmapanel)
      return res.status(400).json({ error: "sigmapanel not found" });
    req.sigmapanel = sigmapanel;
    next();
  } catch (err) {
    console.error("Find by ID error:", err);
    return res.status(400).json({ error: "Could not retrieve sigmapanel" });
  }
};

const read = (req, res) => {
  return res.json(req.sigmapanel);
};

const update = async (req, res) => {
  try {
    let sigmapanel = req.sigmapanel;
    sigmapanel = extend(sigmapanel, req.body);
    await sigmapanel.save();
    res.json(sigmapanel);
  } catch (err) {
    console.error("Update error:", err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

export default {
  create,
  sigmapanelByID,
  read,
  list,
  update
};
