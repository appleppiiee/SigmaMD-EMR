// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaHeartbeat,
  FaUser,
  FaHospital,
  FaCogs
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const userRole = role || localStorage.getItem("role") || "guest";

  console.log("🔐 Sidebar rendered for role:", userRole);


  const canViewSettings = userRole === 'admin' || userRole === 'provider';

  return (
    <div className="sidebar-wall">
      <img src="/sigmalogo.png" alt="Sigma Logo" className="sidebar-logo" />

      <div className="sidebar-section">
        {/* <h3>APPOINTMENT</h3> */}
        <NavLink to="/appointments" className="sidebar-link hover:bg-accent-100/10 ">
          <FaCalendarAlt className="sidebar-icon" /> Sigmapanel
        </NavLink>
       
        <NavLink to="/patient" className="sidebar-link hover:bg-accent-100/10 ">
          <FaUser className="sidebar-icon" /> Patient
        </NavLink>
      </div>

      

      <div className="sidebar-section">
        <h3>SETTINGS</h3>
        {canViewSettings && (
          <>
            <NavLink to="/settings/user" className="sidebar-link hover:bg-accent-100/10 ">
              <FaUser className="sidebar-icon" /> User
            </NavLink>
            <NavLink to="/settings/clinic" className="sidebar-link hover:bg-accent-100/10 ">
              <FaHospital className="sidebar-icon" /> Clinic
            </NavLink>
          </>
        )}
      </div>

    </div>
  );
};

export default Sidebar;
