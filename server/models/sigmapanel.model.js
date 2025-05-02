import mongoose from 'mongoose';
const { Schema } = mongoose;

const SigmapanelSchema = new Schema({
  patientID:  { type: Schema.Types.ObjectId, ref: 'Patient',      required: true },
  appointmentID:{ type: Schema.Types.ObjectId, ref: 'Appointment',required: true },
  doctorID:   { type: Schema.Types.ObjectId, ref: 'User',         required: true },
  visitDateTime: { type: Date, default: Date.now },

  vWeight:        { type: String, trim: true },
  vHeight:        { type: String, trim: true },
  vBmi:           { type: String, trim: true },
  vTemp:          { type: String, trim: true },
  vBloodPressure: { type: String, trim: true },
  vPulseRate:     { type: String, trim: true },

  mhMedicalHistory:     { type: String, trim: true },
  mhFamilyHistory:      { type: String, trim: true },
  mhSocialHistory:      { type: String, trim: true },
  mhAllergies:          { type: String, trim: true },
  mhCurrentMedications: { type: String, trim: true },

  diagnosis:    { type: String, trim: true },
  plMedication: { type: String, trim: true },
  plReferrals:  { type: String, trim: true },
  plFollowup:   { type: String, trim: true },
  plProcedures: { type: String, trim: true },
  notes:        { type: String, trim: true },

  status: { type: String, trim: true, default: 'a' }
},{
  timestamps: true,
  versionKey: false
});

export default mongoose.model('Sigmapanel', SigmapanelSchema);
