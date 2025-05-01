import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./LandingNavbar.css";

import SigmaWhite from "/sigma-white.svg";
import SigmaBlack from "/1Logo.png";

const sections = [
  "services",
  "doctors",
  "partners",
  "clinics",
  "about-us",
  "sigma-team"
];

export default function LandingNavbar({ alwaysDark = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isLanding = location.pathname === "/";
  const isAuth = ["/signin", "/signup"].includes(location.pathname);

  // prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // scroll listener
  useEffect(() => {
    if (!isLanding || alwaysDark) {
      setScrolled(alwaysDark);
      return;
    }

    const onScroll = () => {
      const y = window.scrollY;
      // trigger at Services section
      const services = document.getElementById("services");
      const trigger = (services?.offsetTop || 300) - 100;
      setScrolled(y >= trigger);

      // highlight active section
      const scrollMid = y + 150;
      let found = "";
      for (let id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollMid && el.offsetTop + el.offsetHeight > scrollMid) {
          found = id;
          break;
        }
      }
      setActiveSection(found);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding, alwaysDark]);

  const closeMenu = () => setIsOpen(false);

  const renderLink = (id, label) => (
    <li key={id}>
      <a
        href={`#${id}`}
        onClick={closeMenu}
        className={activeSection === id ? "active-link" : ""}
      >
        {label}
      </a>
    </li>
  );

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        {/* Logo, swaps based on scrolled */}
        <Link to="/" className="logo-section" onClick={closeMenu}>
          <img
            src={scrolled ? SigmaBlack : SigmaWhite}
            alt="Sigma logo"
            className="logo-icon"
          />
        </Link>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setIsOpen((o) => !o)}>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
        </div>

        {/* Desktop Links */}
        {isLanding && !isAuth && (
          <ul className="nav-links desktop-only">
            {renderLink("services", "Services")}
            {renderLink("doctors", "Doctors")}
            {renderLink("partners", "Partners")}
            {renderLink("clinics", "Clinics")}
            {renderLink("about-us", "About Us")}
            {renderLink("sigma-team", "Sigma Team")}
          </ul>
        )}

        {/* Desktop Buttons */}
        <div className="nav-buttons desktop-only">
          <Link to="/signin" className="btn-filled">Sign In</Link>
          {/* <Link to="/signup" className="btn-filled">Sign Up</Link> */}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-drawer">
          <button className="close-icon" onClick={closeMenu}>×</button>
          <ul className="drawer-links">
            {!isAuth ? (
              sections.map((id) =>
                renderLink(
                  id,
                  id
                    .split("-")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(" ")
                )
              )
            ) : (
              <li>
                <Link to="/" onClick={closeMenu}>Home</Link>
              </li>
            )}
            <li><Link to="/signin" onClick={closeMenu}>Sign In</Link></li>
            <li><Link to="/signup" onClick={closeMenu}>Sign Up</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
