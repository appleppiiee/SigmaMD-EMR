/** File name: App.jsx
** Name: Apple Jan Tacardon
** ID: 301426032
** Date: February 5, 2025
**/
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidenav from "./components/Sidenav";
import Home from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

function App() {
    return (
        <Router>
            <Sidenav /> {/* Sidenav remains accessible on all pages */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutMe />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Router>
    );
}

export default App;
