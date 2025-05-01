import React, { useState } from "react";
import "./Signin.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LandingNavbar from "../Landing/LandingNavbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", formData);
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", response.data.user.userType);
  
      console.log("Login success:", response.data);
      navigate("/appointments", { replace: true });
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };
  
  
  return (
    <>
      <LandingNavbar alwaysDark />

      <div className="signin-wrapper">
        <div className="signin-form-section">
          <h1 className="signin-title">Login</h1>
          <p className="signin-subtitle">Login to your account.</p>

          <form className="signin-form" onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                <FaEyeSlash className={`icon ${showPassword ? "hidden" : ""}`} />
                <FaEye className={`icon ${!showPassword ? "hidden" : ""}`} />
              </span>
            </div>

            <div className="signin-remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            {error && <p className="signin-error">{error}</p>}

            <button type="submit" className="signin-btn">Sign In</button>

            <p className="signup-link">
              Don’t have an account yet? <Link to="/signup">Join SigmaMD today.</Link>
            </p>
          </form>
        </div>

        <div className="signin-image-section">
          <img src="/doctor-illustration.png" alt="Doctor Illustration" />
        </div>
      </div>
    </>
  );
};

export default Signin;
