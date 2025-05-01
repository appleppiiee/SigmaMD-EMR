import React from "react";
import "./Doctors.css";

const doctors = [
  {
    name: "Dr. Gabong Abarra",
    specialty: "Cardiologist",
    img: "/DocGab.png",
  },
  {
    name: "Dr. Chesoy Bugarin",
    specialty: "Neurologist",
    img: "/DocChes.png",
  },
  {
    name: "Dr. Ayusa Permar",
    specialty: "Dermatologist",
    img: "/DocAyushi.png",
  },
];

const Doctors = () => {
  return (
    <section id="doctors" className="doctors-section">
      <h3 className="section-title">Our Doctors</h3>
      <div className="doctors-grid">
        {doctors.map((doc, index) => (
          <div className="doctor-card" key={index}>
            <img src={doc.img} alt={doc.name} className="doctor-img" />
            <div className="doctor-info">
              <h4>{doc.name}</h4>
              <p>{doc.specialty}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Doctors;
