// src/DashboardPage.jsx
import React from "react";
// import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DashboardFooter from "./DashboardFooter";
import "../css/dashboard.css";

export default function DashboardPage() {
  const userRole = localStorage.getItem("role") || "admin";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      {/* <Navbar /> */}

      {/* Main content with Sidebar + Page content */}
      <div className="flex flex-1">
        {/* Sidebar - fixed width */}
        <Sidebar role={userRole} />

        {/* Main content area */}
        <main className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          <p>Click on the sidebar items to navigate (Appointments, Patient, etc.)</p>
        </main>
      </div>

      {/* Bottom Footer */}
      <DashboardFooter />
    </div>
  );
}
