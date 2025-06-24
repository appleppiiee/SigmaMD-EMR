import mongoose from 'mongoose';

// Define the schema for each billing item in the checkout
const ItemSchema = new mongoose.Schema({
  // Description of the billed item (e.g., consultation, lab test)
  description: { type: String, required: true },

  // Type/category of item (e.g., service, medication)
  type:        { type: String, required: true },

  // Unit price of the item
  price:       { type: Number, required: true },

  // Quantity of the item billed
  quantity:    { type: Number, required: true },

  // Total amount (price × quantity)
  amount:      { type: Number, required: true }
}, { _id: false }); // Disable _id for subdocuments

// Define the main schema for the checkout/billing record
const CheckoutSchema = new mongoose.Schema({
  // Reference to the related appointment
  appointmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },

  // Reference to the patient being billed
  patientID:     { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },

  // Reference to the clinic where the service occurred
  clinicID:      { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },

  // Reference to the SigmaPanel (clinical chart) associated with this visit
  sigmapanelID:  { type: mongoose.Schema.Types.ObjectId, ref: 'SigmaPanel', required: true },

  // Reference to the doctor who attended the appointment
  doctorID:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Date when the patient checked in for the appointment
  checkInDate: { type: Date, required: true },

  // Time when the patient checked in (in HH:mm format)
  checkInTime: { type: String, required: true },

  // List of individual billing items
  items: { type: [ItemSchema], default: [] },

  // Subtotal amount before tax
  subtotal:  { type: Number, required: true },

  // Tax rate applied to the subtotal (e.g., HST 13%)
  taxRate:   { type: Number, default: 0.13 },

  // Total tax amount (subtotal × taxRate)
  taxAmount: { type: Number, required: true },

  // Total amount billed (subtotal + tax)
  total:     { type: Number, required: true },

  // Payment details
  payment: {
    // Payment method (e.g., Cash, Insurance)
    method:       { type: String, required: true },

    // Amount of cash received from patient
    cashReceived: { type: Number, required: true },

    // Change due to patient after payment
    changeDue:    { type: Number, required: true }
  },

  // Status of the checkout (Pending or Completed)
  checkoutStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Completed'
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the Checkout model
export default mongoose.model('Checkout', CheckoutSchema);
