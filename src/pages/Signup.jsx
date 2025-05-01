import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Signup.css";
import LandingNavbar from "../Landing/LandingNavbar";
import axios from "axios";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/users", data);
      alert("Registration successful!");
      console.log(res.data);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert("Registration failed. Check console.");
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
              <div className="form-group">
                <label>First Name *</label>
                <input
                  placeholder="Enter your first name"
                  {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName && <span className="error">⚠ {errors.firstName.message}</span>}
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  placeholder="Enter your mobile number"
                  {...register("mobileNo", { required: "Mobile number is required" })}
                />
                {errors.mobileNo && <span className="error">⚠ {errors.mobileNo.message}</span>}
              </div>

              <div className="form-group">
                <label>Middle Name</label>
                <input placeholder="Enter your middle name" {...register("middleName")} />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input placeholder="Enter your phone number" {...register("phoneNo")} />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  placeholder="Enter your last name"
                  {...register("lastName", { required: "Last name is required" })}
                />
                {errors.lastName && <span className="error">⚠ {errors.lastName.message}</span>}
              </div>

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

              <div className="form-group">
                <label>E-mail *</label>
                <input
                  type="email"
                  placeholder="Email address must include (@) and (.)"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <span className="error">⚠ {errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label>Specialization</label>
                <input placeholder="Enter your specialization" {...register("specialization")} />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <span className="error">⚠ {errors.password.message}</span>}
              </div>

              <div className="form-group">
                <label>Availability</label>
                <input placeholder="Enter your availability" {...register("availability")} />
              </div>
            </div>
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

            <div className="checkbox-group">
              <label>
                <input type="checkbox" {...register("newsletter")} />
                Yes, I want to receive SigmaMD newsletters
              </label>
            </div>

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
