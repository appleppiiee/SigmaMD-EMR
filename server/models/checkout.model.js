import mongoose from 'mongoose';

const checkoutSchema = new mongoose.Schema({
  
  appointmentID: {
    type: String,
    required: [true, 'Appointment ID is required'],
  },
  sigmapanelID: {
    type: String,
    required: [true, 'Sigmapanel ID is required'],
  },
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required'],
  },
  checkInTime: {
    type: String,
    required: [true, 'Check-in time is required'],
  },
  particulars: {
    type: String,
    required: [true, 'Particulars are required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'HMO'],
    required: [true, 'Payment method is required'],
  },
  amountPaid: {
    type: Number,
    required: [true, 'Amount paid is required'],
  },
  patientID: {
    type: String,
    // ref: 'Patient',
    required: [true, 'Patient ID is required'],
  },
  providerID: {
    type: String,
    // ref: 'Users',
    required: [true, 'Health care provider ID is required'],
  },
  adminID: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    // ref: 'Users',
    required: [true, 'Health care admin ID is required'],
  },
  hmoName: {
    type: String,
  },
  hmoPoc: {
    type: String,  
  },
  hmoContactNo: {
    type: String,
  },
  clinicID: {
    type: String,
    // ref: 'Clinic',
    required: [true, 'Clinic ID is required'],
  },
  remarks: {
    type: String,
  },
  checkoutStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    required: [true, 'Checkout status is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    trim: true,
    default: "a", //'a' for active, 'i' for inactive
  },
});

export default mongoose.model('Checkout', checkoutSchema);
