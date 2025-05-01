// src/pages/Appointment.jsx
import "../css/Appointments.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Appointment() {
  const navigate = useNavigate();
  const now = new Date();
  const defaultDate = now.getFullYear() + "-" +
  String(now.getMonth() + 1).padStart(2, "0") + "-" +
  String(now.getDate()).padStart(2, "0");
  const defaultTime = now.toTimeString().slice(0, 5);

  

  const statusOptions = [
    { value: "all",       label: "All Status"   },
    { value: "confirmed", label: "Confirmed"    },
    { value: "completed", label: "Completed"    },
    { value: "noshow",    label: "No Show"      },
    { value: "cancelled", label: "Cancelled"    },
    { value: "followup",  label: "Follow Up"    },
  ];

  const defaultForm = {
    patient:        "",
    doctor:         "",
    clinic:         "",
    purpose:        "",
    date:           defaultDate,
    time:           defaultTime,
    paymentMethod:  "Cash",
    hmo:            "",
  };

  const calculateAge = (dobString) => {
    if (!dobString) return "";
  
    const dob = new Date(dobString);
    const today = new Date();
  
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
  
    // Adjust if current day is less than birth day
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); // last day of previous month
      days += prevMonth.getDate();
    }
  
    // Adjust if current month is less than birth month
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  
    return `${years}Y-${months}M-${days}D`;
  };

  // Convert "HH:MM" string into a valid Date object with today's date (local)
const getLocalTimeFromString = (timeStr) => {
  if (!timeStr) return "—";
  const today = new Date();
  const [hour, minute] = timeStr.split(":").map(Number);
  today.setHours(hour, minute, 0, 0);
  return today.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

// Convert full UTC datetime to local time string
const getLocalTimeFromISO = (isoStr) => {
  if (!isoStr) return "—";
  return new Date(isoStr).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const formatReadableDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }); // Example output: "April 30, 2025"
};

 
  const [appointments,   setAppointments]   = useState([]);
  const [patients,       setPatients]       = useState([]);
  const [doctors,        setDoctors]        = useState([]);
  const [clinics,        setClinics]        = useState([]);
  const [form,           setForm]           = useState(defaultForm);

  const [viewDate,       setViewDate]       = useState(defaultDate);
  const [filter,         setFilter]         = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter,   setStatusFilter]   = useState("all");

  const [patientSearch,    setPatientSearch]    = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const patientInputRef = useRef();

  // ── Load everything on mount ──
  useEffect(() => {
    (async () => {
      try {
        const [aRes, pRes, uRes, cRes] = await Promise.all([
          axios.get("/api/appointments"),
          axios.get("/api/patients"),
          axios.get("/api/users"),
          axios.get("/api/clinics"),
        ]);
        setAppointments(Array.isArray(aRes.data)? aRes.data : []);
        setPatients(pRes.data || []);
        setDoctors((uRes.data||[]).filter(u=>u.userType==="provider"));
        setClinics(cRes.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // ── Handlers ──
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePatientSearch = e => {
    const term = e.target.value;
    setPatientSearch(term);
    setForm(f => ({ ...f, patient: "" }));
    if (!term.trim()) return setFilteredPatients([]);
    setFilteredPatients(
      patients.filter(p =>
        `${p.firstname} ${p.lastname}`.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const selectPatient = p => {
    setForm(f => ({ ...f, patient: p._id }));
    setPatientSearch(`${p.firstname} ${p.lastname}`);
    setFilteredPatients([]);
  };

  const clearForm = () => {
    setForm(defaultForm);
    setPatientSearch("");
  };

  // ── Create ──
  const addAppointment = async e => {
    e.preventDefault();
    try {
      const datetime = new Date(`${form.date}T${form.time}`);
      const payload = {
        patient: form.patient,
        doctor: form.doctor,
        clinic: form.clinic,
        date: form.date,
        time: form.time,
        purpose: form.purpose,
        paymentMethod: form.paymentMethod,
        hmo: form.hmo
      };
      const res = await axios.post("/api/appointments", payload);
      if (res.data._id) {
        setAppointments(a => [...a, res.data]);
        clearForm();
      }
    } catch (err) {
      console.error(err);
      alert("Could not add appointment.");
    }
  };

  // ── Update status ──
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`/api/appointments/${id}`, { status: newStatus });
      setAppointments(a =>
        a.map(x => x._id === id ? { ...x, status: res.data.status } : x)
      );
    } catch (err) {
      console.error(err);
      alert("Could not update status.");
    }
  };

  // ── Filtering ──
  const filtered = appointments
    .filter(a => (`${a.patient?.firstname||""} ${a.patient?.lastname||""}`)
      .toLowerCase().includes(filter.toLowerCase()))
    .filter(a => locationFilter==="all" ? true : a.clinic?._id===locationFilter)
    .filter(a => statusFilter==="all" ? true : (a.status||"confirmed")===statusFilter)
    .filter(a => new Date(a.datetime).toISOString().slice(0,10)===viewDate);

  return (
    <div className="flex">
      <div className="main-content w-full appointments">
        <div className="flex flex-col lg:flex-row gap-3 p-3" style={{ height: "calc(100vh - 4rem)" }}>

          {/* ─── LEFT PANEL ─── */}
          <form onSubmit={addAppointment}
                className="w-full lg:w-2/5 bg-white p-3 rounded shadow flex flex-col overflow-y-auto">

            {/* NAV PILLS */}
            <div className="flex space-x-2 mb-4">
              <button type="button"
                      className="px-4 py-1 rounded-full bg-green-600 text-white text-sm">
                Appointment
              </button>
              <button type="button"
                      className="px-4 py-1 rounded-full bg-white border border-green-600 text-green-600 text-sm"
                      onClick={()=>navigate("/patient")}>
                Add Patient
              </button>
            </div>

            {/* PATIENT SEARCH */}
            <div className="relative mb-3">
              <input ref={patientInputRef}
                     type="text"
                     value={patientSearch}
                     onChange={handlePatientSearch}
                     placeholder="Search patient name"
                     className="border p-2 w-full" required/>
              {filteredPatients.length>0 && (
                <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto">
                  {filteredPatients.map(p=>(
                    <li key={p._id}
                        onMouseDown={()=>selectPatient(p)}
                        className="p-2 hover:bg-gray-100 cursor-pointer">
                      {p.firstname} {p.lastname}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* PURPOSE */}
            <input name="purpose"
                   value={form.purpose}
                   onChange={handleChange}
                   placeholder="Reason for visit"
                   className="border p-2 mb-3 w-full"
                   required/>

            {/* DOCTOR */}
            <select name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    className="border p-2 mb-3 w-full"
                    required>
              <option value="">Select Doctor</option>
              {doctors.map(d=>(
                <option key={d._id} value={d._id}>
                  Dr. {d.firstName} {d.lastName}
                </option>
              ))}
            </select>

            {/* CLINIC */}
            <select name="clinic"
                    value={form.clinic}
                    onChange={handleChange}
                    className="border p-2 mb-3 w-full"
                    required>
              <option value="">Select Clinic</option>
              {clinics.map(c=>(
                <option key={c._id} value={c._id}>
                  {c.name||c.nameaddress}
                </option>
              ))}
            </select>

            {/* DATE & TIME */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input type="date"
                     name="date"
                     value={form.date}
                     onChange={handleChange}
                     className="border p-2" required/>
              <input type="time"
                     name="time"
                     value={form.time}
                     onChange={handleChange}
                     className="border p-2" required/>
            </div>

            {/* PAYMENT & HMO */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <select name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className="border p-2" required>
                <option value="Cash">Cash</option>
                <option value="Insurance">Insurance</option>
              </select>
              <input name="hmo"
                     value={form.hmo}
                     onChange={handleChange}
                     placeholder="HMO"
                     className="border p-2"/>
            </div>
            {/* ADD + CLEAR */}
            <div className="flex space-x-2">
              <button type="submit"
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-full">
                Save
              </button>
              <button type="button"
                      onClick={clearForm}
                      className="flex-1 border border-red-500 text-red-500 px-4 py-2 rounded-full">
                Clear
              </button>
            </div>
          </form>

          {/* ─── RIGHT PANEL ─── */}
          <div className="w-full lg:w-3/5 bg-white p-3 rounded shadow flex flex-col">
            {/* DATE PICKER + FILTERS */}
            <div className="flex justify-between items-center mb-4">
              <input type="date"
                     value={viewDate}
                     onChange={e=>setViewDate(e.target.value)}
                     className="text-sm p-2"/>
                <div className="flex space-x-3">
                    {/* ─── LOCATION PILL-STYLE SELECT ─── */}
                    <select
                      value={locationFilter}
                      onChange={e => setLocationFilter(e.target.value)}
                      className="
                        appearance-none
                        px-4 py-1
                        rounded-full
                        border
                        border-gray-300
                        bg-white
                        text-sm
                        focus:outline-none
                        focus:ring-2 focus:ring-green-400
                        
                        cursor-pointer
                        "
                    >
                      <option value="all">All Locations</option>
                      {clinics.map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name || c.nameaddress}
                        </option>
                      ))}
                    </select>

                    {/* ─── STATUS PILL-STYLE SELECT ─── */}
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="
                        appearance-none
                        px-4 py-1
                        rounded-full
                        border
                        border-gray-300
                        bg-white
                        text-sm
                        focus:outline-none
                        focus:ring-2 focus:ring-green-400
                        
                        cursor-pointer
                        "
                    >
                      {statusOptions.map(s => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                </div>
            </div>

            {/* PATIENT NAME FILTER */}
            <input className="border p-2 mb-3 w-full"
                   placeholder="Search by patient name"
                   value={filter}
                   onChange={e=>setFilter(e.target.value)}/>

            {/* APPOINTMENT LIST */}
            <ul className="flex-1 overflow-y-auto space-y-2">
              {filtered.map(appt => {
                const apptTime = getLocalTimeFromString(appt.time);
                const startTime = getLocalTimeFromISO(appt.started);
                const endTime = getLocalTimeFromISO(appt.ended);
                
                return (
                  <li key={appt._id}
                      onClick={() =>
                        navigate("/sigmapanel", {
                          state: {
                            appointmentId: appt._id,
                            patientId: appt.patient?._id || "",
                            patientName: `${appt.patient?.firstname || ""} ${appt.patient?.lastname || ""}`,
                            patientAge: calculateAge(appt.patient?.dob),
                            patientSex: appt.patient?.sex || "",
                            appointmentTime: apptTime || "",
                            appointmentDate: formatReadableDate(appt.date),
                            startTime: startTime || "",
                            endTime: endTime || "",                            
                            paymentMethod: appt.paymentMethod || "",
                            clinicName: appt.clinic?.name || "",
                            doctorId: appt.doctor?._id || "",
                            visitDateTime: appt.datetime || "",
                          }
                        })
                      }
                      className="bg-gray-50 p-3 rounded hover:bg-gray-100 flex justify-between items-center cursor-pointer"
                  >


                    <div>
                      <p className="font-medium">
                        {appt.patient?.firstname} {appt.patient?.lastname}
                        {" with Dr. "}
                        {appt.doctor?.firstName} {appt.doctor?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Appt Time {apptTime} • Start {startTime} • End {endTime}
                      </p>

                      <p className="text-sm text-gray-600">
                        {appt.clinic?.name} • {appt.paymentMethod === "Insurance"
                          ? `Insurance: ${appt.hmo}`
                          : appt.paymentMethod
                        } 
                      </p>
                      <p className="text-sm text-gray-600">{appt.purpose}                        
                      </p>
                    </div>
                    <select value={appt.status || "confirmed"}
                            onChange={e=>updateStatus(appt._id, e.target.value)}
                            className="
                      appearance-none
                      px-4 py-1
                      rounded-full
                      border
                      border-gray-300
                      bg-white
                      text-sm
                      focus:outline-none
                      focus:ring-2 focus:ring-green-400
                      
                      cursor-pointer
                      ">
                      {statusOptions
                        .filter(o=>o.value!=="all")
                        .map(o=>(
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                    </select>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
