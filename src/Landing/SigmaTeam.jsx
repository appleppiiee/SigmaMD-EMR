import React from "react";
import "./SigmaTeam.css";

const teamMembers = [
  { name: "Gabriel Abarra", role: "UX/UI, Graphics / Full-Stack Dev", img: "/Gab.jpeg" },
    { name: "Apple Tacardon", role: "Project Lead / Full-Stack Dev", img: "/Apple.jpeg" },
  { name: "Chester Bugarin", role: "Scrum Master / Full-Stack Dev", img: "/Chester.jpeg" },
];

const SigmaTeam = () => {
  return (
    <section id="sigma-team" className="team-section">
      <h3 className="section-title">Sigma Team</h3>

      <div className="team-scroll-wrapper">
        <div className="team-scroll-track">
          {teamMembers.map((member, idx) => (
            <div className="team-card" key={idx}>
              <img src={member.img} alt={member.name} />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SigmaTeam;
