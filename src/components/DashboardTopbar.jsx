import React, { useEffect, useState } from "react";
import "./DashboardTopbar.css";

const DashboardTopbar = ({ sectionTitle }) => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/signin";
  };

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
      <img src="/teamsigma.png" alt="Sigma Logo" className="topbar-logo" />
        {/* <p className="section-title">{sectionTitle}</p> */}
      </div>

      <div className="topbar-right">
        <div className="user-info">
          <span className="user-name">{user?.firstName || "USER NAME"}</span><br/>
          <span className="user-role">Role: {user?.userType?.toLowerCase() || "unknown"}</span>
        </div>
        <img
          src={`https://i.pravatar.cc/40?u=${user?._id || "default"}`}
          alt="User"
          className="user-avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        <span className="dropdown-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
          ▾
        </span>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <button className="hover:bg-accent-100/10 " onClick={handleLogout}>Sign Out</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardTopbar;
