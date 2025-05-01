import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },
  purpose: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: String,         // “YYYY-MM-DD”
    required: true,
  },
  time: {
    type: String,         // “HH:MM”
    required: true,
  },
  started: {
    type: Date,      
    default: null
  },
  ended: {
    type: Date,      
    default: null,
  },
  datetime: {
    type: Date,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash','Insurance'],
    default: 'Cash',
  },
  hmo: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['confirmed','completed','noshow','cancelled','followup'],
    default: 'confirmed',
  },
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model('Appointment', AppointmentSchema);
