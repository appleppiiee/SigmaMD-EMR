// server/controllers/checkout.controller.js

import Checkout from '../models/checkout.model.js';

/**
 * GET /api/checkouts/:checkoutId
 * Retrieves a checkout document by its unique ID.
 */
export const getCheckout = async (req, res) => {
  try {
    // Look up the checkout document by its ID
    const doc = await Checkout.findById(req.params.checkoutId);

    // If not found, return a 404 response
    if (!doc) return res.status(404).json({ message: 'Not found' });

    // Return the checkout data
    res.json(doc);
  } catch (err) {
    // Handle invalid ID or other errors
    res.status(400).json({ message: err.message });
  }
};

/**
 * POST /api/checkouts
 * Creates a new checkout entry with provided data.
 */
export const createCheckout = async (req, res) => {
  try {
    // Create a new checkout document using the request body
    const doc = await Checkout.create(req.body);

    // Return the created document with 201 Created status
    res.status(201).json(doc);
  } catch (err) {
    // Handle validation or creation errors
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/checkouts/:checkoutId
 * Updates an existing checkout entry by its ID.
 */
export const updateCheckout = async (req, res) => {
  try {
    // Find and update the checkout document with new data
    const doc = await Checkout.findByIdAndUpdate(
      req.params.checkoutId,
      req.body,
      { new: true } // Return the updated document
    );

    // If no document is found, return 404
    if (!doc) return res.status(404).json({ message: 'Not found' });

    // Return the updated checkout data
    res.json(doc);
  } catch (err) {
    // Handle update errors (e.g., invalid ID, schema validation)
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /api/checkouts/find?appointmentID=&sigmapanelID=
 * Finds a checkout document by appointment ID and sigmapanel ID.
 */
export const findByAppointmentAndPanel = async (req, res) => {
  const { appointmentID, sigmapanelID } = req.query;

  try {
    // Look for a checkout entry that matches both the appointment and panel ID
    const doc = await Checkout.findOne({ appointmentID, sigmapanelID });

    // If not found, return 404
    if (!doc) return res.status(404).json({ message: 'No checkout found' });

    // Return the matching checkout document
    res.json(doc);
  } catch (err) {
    // Handle any query or execution errors
    res.status(400).json({ message: err.message });
  }
};
