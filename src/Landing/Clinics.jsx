import React from "react";
import "./Clinics.css";

const clinics = [
  {
    name: "Downtown Health Center",
    location: "Toronto, ON",
    image: "/clinic1.jpg",
  },
  {
    name: "WellCare Family Clinic",
    location: "Scarborough, ON",
    image: "/clinic2.jpg",
  },
  {
    name: "North York Medical Hub",
    location: "North York, ON",
    image: "/clinic3.jpg",
  },
];

const Clinics = () => {
  return (
    <section id="clinics" className="clinics-section">
      <h3>Our Clinics</h3>
      <div className="clinics-grid">
        {clinics.map((clinic, index) => (
          <div className="clinic-card" key={index}>
            <img src={clinic.image} alt={clinic.name} className="clinic-image" />
            <div className="clinic-info">
              <h4>{clinic.name}</h4>
              <p>{clinic.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clinics;
