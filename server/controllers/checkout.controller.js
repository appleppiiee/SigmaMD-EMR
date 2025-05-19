// server/controllers/checkout.controller.js
import Checkout from '../models/checkout.model.js'



// get by _id
export const getCheckout = async (req, res) => {
  try {
    const doc = await Checkout.findById(req.params.checkoutId)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// create
export const createCheckout = async (req, res) => {
  try {
    const doc = await Checkout.create(req.body)
    res.status(201).json(doc)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// update
export const updateCheckout = async (req, res) => {
  try {
    const doc = await Checkout.findByIdAndUpdate(
      req.params.checkoutId,
      req.body,
      { new: true }
    )
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const findByAppointmentAndPanel = async (req, res) => {
  const { appointmentID, sigmapanelID } = req.query
  try {
    const doc = await Checkout.findOne({ appointmentID, sigmapanelID })
    if (!doc) return res.status(404).json({ message: 'No checkout found' })
    res.json(doc)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
