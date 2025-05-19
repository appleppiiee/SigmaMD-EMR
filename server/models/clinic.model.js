import mongoose from 'mongoose';

const ClinicSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Clinic name is required']
  },
  nameaddress: {
    type: String,
    trim: true,
    required: [true, 'Address is required']
  },
  phone: { type: String, trim: true },
  mobileNo: {
    type: String,
    trim: true,
    required: [true, 'Mobile number is required']
  },
  remarks: { type: String, trim: true },

  doctorIDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'At least one physician is required']
  }],
  secretaryIDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    trim: true,
    default: 'a'
  }
}, {
  timestamps: true,
  versionKey: false
});

export default mongoose.model('Clinic', ClinicSchema);
