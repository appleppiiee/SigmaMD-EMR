import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
<section id="about-us" className="about-section">
      <div className="about-wrapper">
        <div className="about-left">
          <p className="eyebrow">ABOUT US</p>
          <h1 className="main-heading">
            OUR <br />
            MISSION <br />
            <span>SigmaEMR.</span>
          </h1>
          <p className="aboutus-description">
            Our mission is to revolutionize healthcare through intuitive and reliable EMR solutions. 
            We empower healthcare providers with smart, accessible, and secure tools to streamline workflows and focus on what matters most, the patient.
          </p>
        </div>

        <div className="about-image">
          <img src="/aboutus-main.png" alt="Doctor Illustration" />
        </div>
      </div>

      <div className="about-oblongs">
        <div className="oblong-card">
          <img src="/Workflow.png" alt="Icon 1" className="oblong-icon" />
          <div>
            <h4>Workflow Simplified</h4>
            <p>Reliable tools for efficient workflows and secure patient records.</p>
          </div>
        </div>

        <div className="oblong-card">
          <img src="/Data-Driven.png" alt="Icon 2" className="oblong-icon" />
          <div>
            <h4>Data-Driven Decisions</h4>
            <p>Empowering doctors and clinics with real-time, data-driven medical insights.</p>
          </div>
        </div>

        <div className="oblong-card">
          <img src="/Global.png" alt="Icon 3" className="oblong-icon" />
          <div>
            <h4>Global Compliance</h4>
            <p>EMR system built to meet healthcare standards and scale globally.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
