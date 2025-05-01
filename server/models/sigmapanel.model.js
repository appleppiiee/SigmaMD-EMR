import mongoose from 'mongoose'
const SigmapanelSchema = new mongoose.Schema({

    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },   
    appointmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
    },   
    doctorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    visitDateTime: {
        type: Date,
        default: Date.now   
    },
    vHeight: {
        type: String,
        trim: true,
        required: 'Height is required'
        },
    vWeight: {
        type: String,
        trim: true,
        required: 'Weight is required'
    },
    vBmi: {
        type: String,
        trim: true,
        required: 'BMI is required'
    },
    vTemp: {
        type: String,
        trim: true,
        required: 'Temperature is required'
    },  
    vBloodPressure: {
        type: String,
        trim: true,
        required: 'Blood Pressure is required'
    },
    vPulseRate: {
        type: String,
        trim: true,
        required: 'Pulse Rate is required'
    },
    mhMedicalHistory: {
        type: String,
        trim: true
    },
    mhFamilyHistory: {
        type: String,
        trim: true
    },
    mhSocialHistory: {
        type: String,
        trim: true
    },
     mhAllergies: {
        type: String,
        trim: true
    },
    mhCurrentMedications: {
        type: String,
        trim: true
    },
    diagnosis: {
        type: String,
        trim: true,
        required: 'Diagnosis is required'
    },
    plMedication: {
        type: String,
        trim: true
    },
    plReferrals: {
        type: String,
        trim: true
    },
    plFollowup: {
        type: String,
        trim: true
    },
    plProcedures: {
        type: String,
        trim: true
    },  
    notes: {
        type: String,
        trim: true,
        required: 'Additional Notes is required'
    }, 
    status: {
        type: String,
        trim: true,
        default: "a", //'a' for active, 'i' for inactive
      },          
}, {
timestamps: true,
versionKey: false,
});
export default mongoose.model('Sigmapanel', SigmapanelSchema);
