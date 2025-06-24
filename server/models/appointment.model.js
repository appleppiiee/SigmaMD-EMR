import mongoose from 'mongoose';

// Define the Appointment schema structure
const AppointmentSchema = new mongoose.Schema({
  // Reference to the associated patient document
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },

  // Reference to the doctor (user) handling the appointment
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Reference to the clinic where the appointment is scheduled
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },

  // Purpose or reason for the visit (e.g., consultation, follow-up)
  purpose: {
    type: String,
    trim: true,
    required: true,
  },

  // Appointment date in YYYY-MM-DD format
  date: {
    type: String,
    required: true,
  },

  // Appointment time in HH:MM format
  time: {
    type: String,
    required: true,
  },

  // Timestamp marking when the appointment actually started
  started: {
    type: Date,
    default: null,
  },

  // Timestamp marking when the appointment ended
  ended: {
    type: Date,
    default: null,
  },

  // Combined date and time field for accurate sorting and comparison
  datetime: {
    type: Date,
    required: true,
  },

  // Payment method selected by the patient
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Insurance'],
    default: 'Cash',
  },

  // Name of the HMO or insurance provider if applicable
  hmo: {
    type: String,
    trim: true,
    default: '',
  },

  // Current status of the appointment
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'noshow', 'cancelled', 'followup'],
    default: 'confirmed',
  },
}, {
  // Automatically manage createdAt and updatedAt timestamps
  timestamps: true,

  // Disable the __v version key in the document
  versionKey: false,
});

// Export the Appointment model for use in the application
export default mongoose.model('Appointment', AppointmentSchema);
