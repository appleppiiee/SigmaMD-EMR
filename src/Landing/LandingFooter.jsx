import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src="/1Logo.png" alt="SigmaMD Logo" className="footer-logo" />
          <p className="footer-tagline">
            Compassionate care meets modern health solutions. At SigmaMD, we prioritize your wellness.
          </p>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#doctors">Doctors</a></li>
            <li><a href="#clinics">Clinics</a></li>
            <li><a href="#about-us">About Us</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: contact@sigmamd.ca</p>
          <p>Phone: +1 (416) 123-4567</p>
          <p>Location: Toronto, ON</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SigmaMD. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
