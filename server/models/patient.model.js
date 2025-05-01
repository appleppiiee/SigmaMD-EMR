import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: 'First name is required',
    trim: true
  },
  middlename: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    required: 'Last name is required',
    trim: true
  },
  mobile: String,
  emailAddress: {
    type: String,
    required: 'Email is required',
    unique: true,
    trim: true
  },
  dob: {
    type: Date,
    required: 'Date of birth is required'
  },
  sex: {
    type: String,
    required: 'Sex is required',
    enum: ['Male', 'Female']
  },
  maritalStatus: {
    type: String,
    required: 'Marital status is required'
  },
  bloodType: {
    type: String,
    required: 'Blood type is required'
  },
  address: String,
  remarks: String
}, { timestamps: true });

export default mongoose.model('Patient', PatientSchema);
