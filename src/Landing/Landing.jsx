import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import Services from "./Services";
import Doctors from "./Doctors";
import Partners from "./Partners";
import Clinics from "./Clinics";
import AboutUs from "./AboutUs";
import SigmaTeam from "./SigmaTeam";
import LandingFooter from "./LandingFooter";

const isAuth = ["/signup"].includes(location.pathname);


const LandingPage = () => {
  return (
    <div className="landing-wrapper" id="landing-page">
      <div className="banner-container">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="banner-video"
        >
          <source src="/LandingVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="banner-content">
          <div className="banner-heading">
            <h2>Streamline your<br />Clinic, Anytime,<br />Anywhere</h2>
          </div>

          <div className="banner-subheading">
            
        <p>
        SigmaMD is an electronic medical record system from<br />
        patient demographics to schedule appointments,<br />
        clinical visit note and billing for streamlined care.
        </p>

          </div>

          <div className="banner-buttons">
            <Link to="/signup" className="banner-appointment-button">Sign Up For A Free Trial</Link>
            
          </div>
        </div>
      </div>

      <Services />
      <Doctors />
      <Partners />
      <Clinics />
      <AboutUs />
      <SigmaTeam />

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
