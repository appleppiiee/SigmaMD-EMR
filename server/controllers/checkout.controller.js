import Checkout from '../models/checkout.model.js'

/**
 * GET  /api/checkouts
 */
export const listCheckouts = async (req, res) => {
  try {
    const all = await Checkout.find()
      .populate('appointmentID patientID clinicID sigmapanelID doctorID')
      .sort('-createdAt')
    res.json(all)
  } catch(err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to list checkouts.' })
  }
}

/**
 * GET  /api/checkouts/:checkoutId
 */
export const getCheckout = async (req, res) => {
  try {
    const one = await Checkout.findById(req.params.checkoutId)
      .populate('appointmentID patientID clinicID sigmapanelID doctorID')
    if (!one) return res.status(404).json({ message: 'Not found' })
    res.json(one)
  } catch(err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch checkout.' })
  }
}

/**
 * POST /api/checkouts
 */
export const createCheckout = async (req, res) => {
  try {
    const {
      appointmentID, patientID, clinicID, sigmapanelID, doctorID,
      checkInDate, checkInTime,
      items,
      payment: { method, cashReceived, changeDue }
    } = req.body

    // server‐side recompute
    const subtotal  = items.reduce((s, i) => s + i.amount, 0)
    const taxRate   = 0.13
    const taxAmount = parseFloat((subtotal * taxRate).toFixed(2))
    const total     = parseFloat((subtotal + taxAmount).toFixed(2))

    const chk = await Checkout.create({
      appointmentID, patientID, clinicID, sigmapanelID, doctorID,
      checkInDate, checkInTime,
      items,
      subtotal, taxRate, taxAmount, total,
      payment: { method, cashReceived, changeDue: parseFloat(changeDue.toFixed(2)) },
      checkoutStatus: 'Completed'
    })

    res.status(201).json(chk)
  } catch(err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
}

/**
 * PUT  /api/checkouts/:checkoutId
 */
export const updateCheckout = async (req, res) => {
  try {
    // find existing
    const existing = await Checkout.findById(req.params.checkoutId)
    if (!existing) return res.status(404).json({ message: 'Not found' })

    // merge in updates
    const data = req.body
    // if items changed, recompute totals again
    if (data.items) {
      const subtotal  = data.items.reduce((s,i) => s + i.amount, 0)
      const taxRate   = 0.13
      const taxAmount = parseFloat((subtotal * taxRate).toFixed(2))
      const total     = parseFloat((subtotal + taxAmount).toFixed(2))
      existing.subtotal  = subtotal
      existing.taxRate   = taxRate
      existing.taxAmount = taxAmount
      existing.total     = total
    }

    // allow updating payment.* or checkoutStatus, etc
    if (data.payment) {
      existing.payment.method       = data.payment.method       ?? existing.payment.method
      existing.payment.cashReceived = data.payment.cashReceived ?? existing.payment.cashReceived
      existing.payment.changeDue    = data.payment.changeDue    ?? existing.payment.changeDue
    }
    if (data.checkoutStatus) existing.checkoutStatus = data.checkoutStatus

    // you could allow checkInDate, checkInTime, doctorID, etc

    const updated = await existing.save()
    res.json(updated)
  } catch(err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
}
