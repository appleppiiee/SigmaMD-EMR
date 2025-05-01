import "../css/Sigmapanel.css";  
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; 
import axios from "axios";

export default function SigmaPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);

  const appointmentId = location.state?.appointmentId || '';
  const patientId = location.state?.patientId || '';
  const doctorId = location.state?.doctorId || '';
  const patientAge = location.state?.patientAge || '';
  const patientSex = location.state?.patientSex || '';  
  const patientName = location.state?.patientName || '';
  const visitDateTime = location.state?.visitDateTime || '';
  const appointmentTime = location.state?.appointmentTime || '';
  const appointmentDate = location.state?.appointmentDate || '';
  const startTime = location.state?.startTime || '';
  const endTime = location.state?.endTime || '';
  const paymentMethod = location.state?.paymentMethod || '';
  const clinicName = location.state?.clinicName || '';
  console.log(patientId, appointmentId, doctorId);
  const [viewDate, setViewDate] = useState(defaultDate);
  const [startedLogged, setStartedLogged] = useState(false);

  const [vitals, setVitals] = useState({
    vWeight: "", vHeight: "", vBmi: "", vTemp: "",
    vBloodPressure: "", vPulseRate: ""
  });

  const [history, setHistory] = useState({
    mhMedicalHistory: "", mhFamilyHistory: "", mhSocialHistory: "",
    mhAllergies: "", mhCurrentMedications: ""
  });

  const [diagnosis, setDiagnosis] = useState({
    diagnosis: "", plMedication: "", plReferrals: "", plFollowup: "", plProcedures: "", notes: ""
  });

  const handleChange = setter => async e => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

    if (!startedLogged && appointmentId) {
      try {
        await axios.put(`/api/appointments/${appointmentId}`, {
          started: new Date().toISOString(),
        });
        setStartedLogged(true);
      } catch (err) {
        console.error("Failed to mark visit as started:", err);
      }
    }
  };
//save the data to the database
  const handleSubmit = async e => {
    e.preventDefault();

    if (!patientId || !appointmentId || !doctorId) {
      alert("Missing required IDs");
      console.log(patientId, appointmentId, doctorId);
      return;
    }

    try {
      await axios.post("/api/sigmapanels", {
        patientID: patientId,
        appointmentID: appointmentId,
        doctorID: doctorId,
        visitDateTime: visitDateTime,
        ...vitals,
        ...history,
        ...diagnosis
      });

      await axios.put(`/api/appointments/${appointmentId}`, {
        ended: new Date().toISOString(),
      });

      navigate("/checkout", {
        state: {
          patientId,
          patientName,
          patientAge,
          patientSex,
          appointmentDate,
          appointmentTime,
          startTime,
          endTime,
          paymentMethod,
          clinicName
        }
      });

    } catch (err) {
      console.error("Error submitting clinic documentation:", err);
      alert("Failed to save clinic documentation.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="main-content w-full sigmapanel">

        <div className="bg-white px-4 py-3 rounded shadow flex justify-between items-center mt-4 mx-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/appointments")}
              className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-700 hover:bg-blue-200 transition"
              title="Back to Appointments"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <p className="font-semibold text-lg uppercase tracking-wide">{patientName || 'N/A'}</p>
              <p className="text-sm text-gray-500">{patientAge || 'N/A'} | {patientSex || 'N/A'}</p>
              <p className="text-sm text-gray-500">{clinicName || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600 font-medium">Visit Date</p>
            <input
              type="date"
              value={viewDate}
              onChange={e => setViewDate(e.target.value)}
              className="border text-sm p-2 rounded shadow-sm"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-3 p-3" style={{ height: "calc(100vh - 4rem)" }}>
          <div className="w-full lg:w-1/2 bg-white p-3 rounded shadow flex flex-col overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Vitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.keys(vitals).map(field => (
                <input key={field} name={field} placeholder={field} value={vitals[field]} onChange={handleChange(setVitals)} className="border p-2" />
              ))}
            </div>

            <h2 className="text-lg font-semibold mb-4">Medical History</h2>
            {Object.keys(history).map(field => (
              field.includes("MedicalHistory") ?
                <textarea key={field} name={field} placeholder={field} value={history[field]} onChange={handleChange(setHistory)} className="border p-2 mb-2 w-full" /> :
                <input key={field} name={field} placeholder={field} value={history[field]} onChange={handleChange(setHistory)} className="border p-2 mb-2 w-full" />
            ))}
          </div>

          <div className="w-full lg:w-1/2 bg-white p-3 rounded shadow flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Diagnosis</h2>
            {Object.keys(diagnosis).map(field => (
              field === "notes" ?
                <textarea key={field} name={field} placeholder={field} value={diagnosis[field]} onChange={handleChange(setDiagnosis)} className="border p-2 mb-2 w-full" /> :
                <input key={field} name={field} placeholder={field} value={diagnosis[field]} onChange={handleChange(setDiagnosis)} className="border p-2 mb-2 w-full" />
            ))}
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded w-full mt-4">
              End Clinic Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
