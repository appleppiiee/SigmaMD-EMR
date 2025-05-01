import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <section id="services" className="services-section">
      <h3 className="section-title">Our Services</h3>
      <div className="services-wrapper">
        <div className="service-card">
          <img src="/Intuitive.png" alt="EMR Platform" />
          <h4>Intuitive EMR Platform</h4>
          <p>Simplify your clinical workflow with seamless, easy-to-use record management.</p>
        </div>
        <div className="service-card">
          <img src="/Comprehensive.png" alt="Data Records" />
          <h4>Comprehensive Patient Records</h4>
          <p>Access secure, centralized health records to improve decisions and outcomes.</p>
        </div>        
        <div className="service-card">
          <img src="/Smart.png" alt="Analytics" />
          <h4>Smart Analytics & Insights</h4>
          <p>Use real-time data and trends to deliver personalized, proactive care.</p>
        </div>
        <div className="service-card">
          <img src="/Global-Ready.png" alt="Compliance" />
          <h4>Global-Ready Compliance</h4>
          <p>Confidently operate across regions with secure and compliant EMR technology.</p>
        </div>
      </div>
    </section>
  );
};

export default Services;
