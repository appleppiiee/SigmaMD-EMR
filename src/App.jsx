// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/dashboard.css";            // ← make sure this is here
import LandingNavbar from "./Landing/LandingNavbar";
import LandingPage   from "./Landing/Landing";
import Signin        from "./pages/Signin";
import Signup        from "./pages/Signup";
import Appointments  from "./pages/Appointments";
import SigmaPanel    from "./pages/SigmaPanel";
import Checkout      from "./pages/Checkout";
import Patient       from "./pages/Patients";
import Clinic        from "./pages/Clinic";
import Users         from "./pages/Users";
import Sidebar       from "./components/Sidebar";
import Topbar        from "./components/DashboardTopbar";
import DashboardPage from "./components/DashboardPage";

const DashboardLayout = ({ children }) => (
  <div className="dashboard-container">
    <Sidebar />                                 {/* already has .sidebar-wall */}
    <div className="main-content">
      <Topbar />                                {/* already has .dashboard-topbar */}
      <div className="dashboard-main-area">
        {children}
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/"       element={<><LandingNavbar /><LandingPage/></>} />
        <Route path="/signin" element={<><LandingNavbar /><Signin/></>} />
        <Route path="/signup" element={<><LandingNavbar /><Signup/></>} />

        {/* all dashboard pages → same shell */}
        <Route path="/dashboard"
          element={ <DashboardLayout><DashboardPage/></DashboardLayout> } />

        <Route path="/appointments"
          element={ <DashboardLayout><Appointments/></DashboardLayout> } />
        <Route path="/sigmapanel"
          element={ <DashboardLayout><SigmaPanel/></DashboardLayout> } />
        <Route path="/checkout"
          element={ <DashboardLayout><Checkout/></DashboardLayout> } />
        <Route path="/patient"
          element={ <DashboardLayout><Patient/></DashboardLayout> } />
        <Route path="/settings/user"
          element={ <DashboardLayout><Users/></DashboardLayout> } />
        <Route path="/settings/clinic"
          element={ <DashboardLayout><Clinic/></DashboardLayout> } />
      </Routes>
    </BrowserRouter>
  );
}
