import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
 
  firstName: {
    type: String,
    required: "First name is required",
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: "Last name is required",
    trim: true
  },
  dob: {
    type: Date
    // required: 'Date of birth is required'
  },
  mobileNo: {
    type: String,
    required: "Mobile number is required",
    trim: true
  },  
  email: {
    type: String,
    required: "Email is required",
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  password: {
    type: String,
    required: "Password is required",
    default: "12345678",//will be updated once user resets password
    select: false
  },
  userType: {
    type: String,
    enum: ["admin", "physician", "secretary"],
    required: "User type is required"
  },
  doctorType: {
    type: String, // e.g. "Surgeon", "Psychiatrist"
    // required: "Doctor type is required",
  },
  specialization: {
    type: String, // e.g. "ENT", "Cardiology"
    required: "Specialization is required"
  },
  availability: {
    type: String, // e.g. "Mon-Fri, 9AM-5PM",
    required: "Availability is required"
  },
  clinicID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
    },
  remarks: {
    type: String
  },    
  status: {
    type: String,
    trim: true,
    default: "a", //'a' for active, 'i' for inactive
  }
}, { 
  timestamps: true,
  versionKey: false 
});

export default mongoose.model("User", UserSchema);
