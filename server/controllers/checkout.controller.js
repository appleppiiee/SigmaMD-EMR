import Checkout from '../models/checkout.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

const create = async (req, res) => {
  const checkout = new Checkout(req.body);
  try {
    await checkout.save();
    return res.status(200).json({
      message: "Checkout successfully created!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    const checkouts = await Checkout.find()
      .select('appointmentID sigmapanelID checkInDate checkInTime particulars quantity amount paymentMethod amountPaid patientID providerID adminID hmoName hmoPOC hmoContactNo clinicID remarks checkoutStatus createdAt updatedAt status');
    return res.json(checkouts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const checkoutByID = async (req, res, next, id) => {
  try {
    const checkout = await Checkout.findById(id);
    if (!checkout) return res.status('400').json({
      error: "Checkout not found",
    });
    req.profile = checkout;
    next();
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve checkout",
    });
  }
};

const read = (req, res) => {
  req.profile.updatedAt = undefined;  
  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let checkout = req.profile;
    checkout = extend(checkout, req.body);
    checkout.updatedAt = Date.now();
    await checkout.save();
    res.json(checkout);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};


export default {
  create,
  checkoutByID,
  read,
  list,
  update,
};
