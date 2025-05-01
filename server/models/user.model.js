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
  mobileNo: {
    type: String,
    required: "Mobile number is required",
    trim: true
  },
  phoneNo: {
    type: String,
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
    select: false
  },
  userType: {
    type: String,
    enum: ["admin", "provider", "secretary"],
    required: "User type is required"
  },
  doctorType: {
    type: String // e.g. "Surgeon", "Psychiatrist"
  },
  specialization: {
    type: String // e.g. "ENT", "Cardiology"
  },
  availability: {
    type: String // e.g. "Mon-Fri, 9AM-5PM"
  },
  clinicRoomNo: {
    type: String // e.g. "Room 101", "Clinic B2"
  },
  remarks: {
    type: String
  },  
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date
  },
  status: {
    type: String,
    trim: true,
    default: "a", //'a' for active, 'i' for inactive
  }
}, { versionKey: false });

export default mongoose.model("User", UserSchema);
