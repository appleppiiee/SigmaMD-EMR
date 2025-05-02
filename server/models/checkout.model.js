import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  type:        { type: String, required: true },
  price:       { type: Number, required: true },
  quantity:    { type: Number, required: true },
  amount:      { type: Number, required: true }
}, { _id: false })

const CheckoutSchema = new mongoose.Schema({
  appointmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientID:     { type: mongoose.Schema.Types.ObjectId, ref: 'Patient',     required: true },
  clinicID:      { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic',      required: true },
  sigmapanelID:  { type: mongoose.Schema.Types.ObjectId, ref: 'SigmaPanel',  required: true },
  doctorID:      { type: mongoose.Schema.Types.ObjectId, ref: 'User',        required: true },

  checkInDate: { type: Date,   required: true },
  checkInTime: { type: String, required: true },

  items:      { type: [ItemSchema], default: [] },

  subtotal:  { type: Number, required: true },
  taxRate:   { type: Number, default: 0.13 },
  taxAmount: { type: Number, required: true },
  total:     { type: Number, required: true },

  payment: {
    method:       { type: String, required: true },
    cashReceived: { type: Number, required: true },
    changeDue:    { type: Number, required: true }
  },

  checkoutStatus: { type: String, enum: ['Pending','Completed'], default: 'Pending' }
}, { timestamps: true })

export default mongoose.model('Checkout', CheckoutSchema)
