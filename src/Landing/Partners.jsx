import React from "react";
import "./Partners.css";

const Partners = () => {
  return (
<section id="partners" className="partners-section">
      <h3 className="section-title">Our Health Partners</h3>
      <div className="partners-grid">
        <img src="/OHIP.png" alt="Partner 1" />
        <img src="/GuardMe.png" alt="Partner 2" />
        <img src="/UHN.png" alt="Partner 3" />
        <img src="/UofT.png" alt="Partner 4" />
      </div>
    </section>
  );
};

export default Partners;
