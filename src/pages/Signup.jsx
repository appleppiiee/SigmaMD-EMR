/**
 * Signup.jsx
 * Renders the user registration page for the SigmaMD platform.
 * Provides form inputs for user details and handles account creation via API.
 */

import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Signup.css";
import LandingNavbar from "../Landing/LandingNavbar";
import axios from "axios";

/**
 * Signup component
 * Uses React Hook Form to manage form state and validation.
 * Submits data to the backend API to register a new user.
 */
const Signup = () => {
  // Initialize form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * Handles form submission
   * Sends user data to the backend and displays feedback to the user.
   * @param {Object} data - Form data submitted by the user.
   */
  const onSubmit = async (data) => {
    try {
      // POST user registration data to the server
      const res = await axios.post("http://localhost:3000/api/users", data);
      alert("Registration successful!");
      console.log(res.data);
    } catch (err) {
      // Log and alert error if registration fails
      console.error("Registration error:", err.response?.data || err.message);
      alert("Registration failed. Check console.");
    }
  };

  return (
    <>
      {/* Navbar for landing pages */}
      <LandingNavbar alwaysDark />

      <div className="signup-container">
        {/* Left side illustration and marketing copy */}
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

        {/* Right side form container */}
        <div className="signup-form-container">
          <h2>Welcome to Sigma Registration</h2>
          <p className="subtext">Register your account</p>

          {/* Signup form begins here */}
          <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="signup-grid">
              {/* First Name */}
              <div className="form-group">
                <label>First Name *</label>
                <input
                  placeholder="Enter your first name"
                  {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName && <span className="error">⚠ {errors.firstName.message}</span>}
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  placeholder="Enter your mobile number"
                  {...register("mobileNo", { required: "Mobile number is required" })}
                />
                {errors.mobileNo && <span className="error">⚠ {errors.mobileNo.message}</span>}
              </div>

              {/* Middle Name (optional) */}
              <div className="form-group">
                <label>Middle Name</label>
                <input placeholder="Enter your middle name" {...register("middleName")} />
              </div>

              {/* Phone Number (optional) */}
              <div className="form-group">
                <label>Phone Number</label>
                <input placeholder="Enter your phone number" {...register("phoneNo")} />
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  placeholder="Enter your last name"
                  {...register("lastName", { required: "Last name is required" })}
                />
                {errors.lastName && <span className="error">⚠ {errors.lastName.message}</span>}
              </div>

              {/* User Type Selection */}
              <div className="form-group">
                <label>User Type *</label>
                <select
                  className="custom-select"
                  {...register("userType", { required: "Select a user type" })}
                >
                  <option value="">Select User Type</option>
                  <option value="provider">Provider</option>
                  <option value="secretary">Secretary</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.userType && <span className="error">⚠ {errors.userType.message}</span>}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label>E-mail *</label>
                <input
                  type="email"
                  placeholder="Email address must include (@) and (.)"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <span className="error">⚠ {errors.email.message}</span>}
              </div>

              {/* Specialization (optional) */}
              <div className="form-group">
                <label>Specialization</label>
                <input placeholder="Enter your specialization" {...register("specialization")} />
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <span className="error">⚠ {errors.password.message}</span>}
              </div>

              {/* Availability (optional) */}
              <div className="form-group">
                <label>Availability</label>
                <input placeholder="Enter your availability" {...register("availability")} />
              </div>
            </div>

            {/* Terms and Policy Agreement */}
            <div className="checkbox-wrapper">
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    {...register("terms", { required: "You must agree to terms" })}
                  />
                  I agree to all the <a href="#">Terms</a>, <a href="#">Privacy Policy</a>
                </label>
              </div>
              {errors.terms && <span className="error">⚠ {errors.terms.message}</span>}
            </div>

            {/* Newsletter Subscription (optional) */}
            <div className="checkbox-group">
              <label>
                <input type="checkbox" {...register("newsletter")} />
                Yes, I want to receive SigmaMD newsletters
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="signup-btn">
              Create Account
            </button>

            {/* Redirect to login page if user already has an account */}
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
