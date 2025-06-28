// src/pages/Signup.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Signup.css";
import LandingNavbar from "../Landing/LandingNavbar";
import axios from "axios";

// 1) Ensures default clinic exists (or creates it) via your signupCreateClinic endpoint
async function getOrCreateDefaultClinic() {
  const { data } = await axios.post(
    "http://localhost:3000/api/clinics/signup"
  );
  return data; // { _id, name, nameaddress, mobileNo, ... }
}

// 2) Calls your user-signup endpoint which attaches that clinicID under the hood
async function signupCreateUser(userPayload) {
  const { data } = await axios.post(
    "http://localhost:3000/api/users/signup",
    userPayload
  );
  return data; // the newly created user (safe version)
}

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * 1) create or fetch default clinic
   * 2) create the user with clinicID
   */
  const onSubmit = async (data) => {
    try {
      // step 1: ensure default clinic
      const clinic = await getOrCreateDefaultClinic();
      // step 2: create user
      const userPayload = {
        ...data,
        clinicID: clinic._id,
      };
      const newUser = await signupCreateUser(userPayload);

      alert("Registration successful!");
      console.log("Created user:", newUser);
      return navigate("/signin");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert("Registration failed. See console for details.");
    }
  };

  return (
    <>
      <LandingNavbar alwaysDark />

      <div className="signup-container">
        <div className="signup-illustration">
          <img src="/signup-illustration.png" alt="Doctor Illustration" />
          <div className="signup-overlay">
            <h2>Clinic Platform</h2>
            <div className="underline" />
            <p>
              Manage all patients through Clinic record
              <br />
              registration system
            </p>
          </div>
        </div>

        <div className="signup-form-container">
          <h2>Welcome to Sigma Registration</h2>
          <p className="subtext">Register your account</p>

          <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="signup-grid">
              {/* First Name */}
              <div className="form-group">
                <label>First Name *</label>
                <input
                  placeholder="Enter your first name"
                  {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName && (
                  <span className="error">⚠ {errors.firstName.message}</span>
                )}
              </div>

              {/* Middle Name */}
              <div className="form-group">
                <label>Middle Name</label>
                <input placeholder="Enter your middle name" {...register("middleName")} />
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  placeholder="Enter your last name"
                  {...register("lastName", { required: "Last name is required" })}
                />
                {errors.lastName && (
                  <span className="error">⚠ {errors.lastName.message}</span>
                )}
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  placeholder="Enter your mobile number"
                  {...register("mobileNo", { required: "Mobile number is required" })}
                />
                {errors.mobileNo && (
                  <span className="error">⚠ {errors.mobileNo.message}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label>E-mail *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <span className="error">⚠ {errors.email.message}</span>}
              </div>

              {/* User Type */}
              <div className="form-group">
                <label>User Type *</label>
                <select {...register("userType", { required: "Select a user type" })}>
                  <option value="">Select User Type</option>
                  <option value="admin">Admin</option>
                  <option value="physician">Physician</option>
                  <option value="secretary">Secretary</option>
                </select>
                {errors.userType && (
                  <span className="error">⚠ {errors.userType.message}</span>
                )}
              </div>

              {/* Specialization */}
              <div className="form-group">
                <label>Specialization</label>
                <input
                  placeholder="Enter your specialization"
                  {...register("specialization")}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <span className="error">⚠ {errors.password.message}</span>
                )}
              </div>

              {/* Availability */}
              <div className="form-group">
                <label>Availability</label>
                <input
                  placeholder="Enter your availability"
                  {...register("availability")}
                />
              </div>
            </div>

            {/* Terms & Privacy */}
            <div className="checkbox-wrapper">
              <label>
                <input
                  type="checkbox"
                  {...register("terms", { required: "You must agree to terms" })}
                />
                I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
              </label>
              {errors.terms && <span className="error">⚠ {errors.terms.message}</span>}
            </div>

            {/* Newsletter */}
            <div className="checkbox-group">
              <label>
                <input type="checkbox" {...register("newsletter")} />
                Subscribe to SigmaMD newsletter
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="signup-btn">
              Create Account
            </button>

            <p className="signin-redirect">
              Already have an account? <Link to="/signin">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
