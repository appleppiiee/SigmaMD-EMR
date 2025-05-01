import mongoose from 'mongoose';

const ClinicSchema = new mongoose.Schema({
  // Display name of the clinic (used in dropdowns)
  name: {
    type: String,
    trim: true,
    required: [true, 'Clinic name is required'],
  },
  // For legacy data support, fallback if name is missing
  nameaddress: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  mobileNo: {
    type: String,
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  providerID: {
    type: String,
    trim: true,
  },
  adminID: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    trim: true,
    default: 'a', // 'a' for active, 'i' for inactive
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Clinic', ClinicSchema);
