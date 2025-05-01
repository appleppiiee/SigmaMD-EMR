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
        <NavLink to="/appointments" className="sidebar-link">
          <FaCalendarAlt className="sidebar-icon" /> Sigmapanel
        </NavLink>
        {/* <NavLink to="/sigmapanel" className="sidebar-link">
          <FaHeartbeat className="sidebar-icon" /> Sigma Panel
        </NavLink> */}
        <NavLink to="/patient" className="sidebar-link">
          <FaUser className="sidebar-icon" /> Patient
        </NavLink>
      </div>

      

      <div className="sidebar-section">
        <h3>SETTINGS</h3>
        {canViewSettings && (
          <>
            <NavLink to="/settings/user" className="sidebar-link">
              <FaUser className="sidebar-icon" /> User
            </NavLink>
            <NavLink to="/settings/clinic" className="sidebar-link">
              <FaHospital className="sidebar-icon" /> Clinic
            </NavLink>
          </>
        )}
      </div>

      {/* <div className="sidebar-section">
        <h3>OTHERS</h3>
        <NavLink to="/checkout" className="sidebar-link">
          <FaCogs className="sidebar-icon" /> Checkout
        </NavLink>
      </div> */}
    </div>
  );
};

export default Sidebar;
