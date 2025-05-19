// src/pages/Appointments.jsx
import '../css/Appointments.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserIcon, FileTextIcon, DollarSignIcon } from 'lucide-react';
import {
  getTorontoDateString,
  calculateAge,
  formatTime,
  formatISOTime,
  formatDate,
  TimeBox,
  calcDuration
} from '../utils/datetime';

export default function Appointments() {
  const navigate = useNavigate();
  const patientRef = useRef();

  // ── 1) Auth check ─────────────────────────────
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return null;
  }
  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  // ── Defaults & options ─────────────────────────
  const defaultDate = getTorontoDateString();
  const defaultTime = new Date().toLocaleTimeString('en-CA', {
    timeZone: 'America/Toronto',
    hour12: false, hour: '2-digit', minute: '2-digit'
  });
  const statusOptions = [
    { value: 'all',       label: 'All Status' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'noshow',    label: 'No Show' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'followup',  label: 'Follow Up' },
  ];
  const defaultForm = {
    patient: '', doctor: '', clinic: '',
    purpose: '', date: defaultDate,
    time: defaultTime,
    paymentMethod: 'Cash', hmo: ''
  };

  // ── State ──────────────────────────────────────
  const [appointments, setAppointments] = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [clinics,      setClinics]      = useState([]);
  const [form,         setForm]         = useState(defaultForm);
  const [viewDate, setViewDate] = useState(defaultDate);
  const [locFil,   setLocFil]   = useState('all');
  const [statFil,  setStatFil]  = useState('all');
  const [pSearch,  setPSearch]  = useState('');
  const [fPatients,setFP]       = useState([]);

  // ── Load initial data ─────────────────────────
  useEffect(() => {
    api.get('/appointments').then(r => setAppointments(r.data || [])).catch(() => alert('Failed loading appointments'));
    api.get('/patients').then(r => setPatients(r.data || [])).catch(() => {});
    api.get('/users').then(r => setDoctors((r.data||[]).filter(u=>u.userType==='provider'))).catch(() => {});
    api.get('/clinics').then(r => setClinics(r.data||[])).catch(() => {});
  }, []);

  // ── Form handlers ─────────────────────────────
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePSearch = e => {
    const t = e.target.value;
    setPSearch(t);
    setForm(f => ({ ...f, patient: '' }));
    if (!t.trim()) return setFP([]);
    setFP(patients.filter(p => (`${p.firstname} ${p.lastname}`).toLowerCase().includes(t.toLowerCase())));
  };
  const selectPatient = p => {
    setForm(f => ({ ...f, patient: p._id }));
    setPSearch(`${p.firstname} ${p.lastname}`);
    setFP([]);
  };
  const clearForm = () => {
    setForm(defaultForm);
    setPSearch('');
  };

  // ── Create appointment ─────────────────────────
  const addAppointment = async e => {
    e.preventDefault();
    try {
      const { data: appt } = await api.post('/appointments', form);
      setAppointments(a => [...a, appt]);
      clearForm();
      // create panel
      api.post('/sigmapanels', {
        appointmentID: appt._id,
        patientID:     appt.patient._id,
        doctorID:      appt.doctor._id
      }).catch(() => {});
    } catch {
      alert('Failed to create appointment');
    }
  };

  // ── Update status ─────────────────────────────
  const updateStatus = async (id,newStatus) => {
    try {
      const { data } = await api.put(`/appointments/${id}`, { status: newStatus });
      setAppointments(a => a.map(x => x._id===id ? { ...x, status: data.status } : x));
    } catch {
      alert('Could not update status');
    }
  };

  // ── Open visit ────────────────────────────────
  const handleOpenVisit = async appt => {
    if (!appt.started) {
      try {
        const started = new Date().toISOString();
        await api.put(`/appointments/${appt._id}`, { started });
        setAppointments(a => a.map(x=>x._id===appt._id?{...x,started}:x));
      } catch {}
    }
    navigate('/sigmapanel', {
      state: {
        appointmentId:   appt._id,
        patientId:       appt.patient._id,
        doctorId:        appt.doctor._id,
        patientName:     `${appt.patient.lastname}, ${appt.patient.firstname}`,
        patientAge:      calculateAge(appt.patient.dob),
        patientSex:      appt.patient.sex,
        appointmentDate: formatDate(appt.date),
        appointmentTime: formatTime(appt.time),
        clinicName:      appt.clinic?.name || appt.clinic?.nameaddress,
        clinicId:        appt.clinic?._id,
        paymentMethod:   appt.paymentMethod==='Insurance'?appt.hmo:appt.paymentMethod
      }
    });
  };

  // ── Filtered list ─────────────────────────────
  const filtered = appointments
    .filter(a => a.date && new Date(a.date).toISOString().slice(0,10)===viewDate)
    .filter(a => locFil==='all'||a.clinic?._id===locFil)
    .filter(a => statFil==='all'||(a.status||'confirmed')===statFil);

  return (
    <div className="flex h-full p-3">
      <div className="w-full flex flex-col lg:flex-row gap-3">

        {/* ── LEFT: Form ─────────────────────────── */}
        <form onSubmit={addAppointment}
              className="w-full lg:w-2/5 bg-white p-6 rounded-lg shadow space-y-5 overflow-y-auto">

          {/* Primary / Secondary */}
          <div className="space-x-4">
            <button type="button"
                    className="
                      bg-accent-200 text-on-accent
                      hover:bg-accent-200
                      focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2
                      font-medium px-5 py-2 rounded-full
                    ">
              Appointment
            </button>
            <button type="button" onClick={()=>navigate('/patient')}
                    className="
                      border-2 border-accent-100 text-on-accent bg-transparent
                      hover:bg-accent-100/10
                      focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2
                      font-medium px-5 py-2 rounded-full
                    ">
              Add Patient
            </button>
          </div>

          {/* Search patient */}
          <div className="relative">
            <input
              ref={patientRef}
              type="text"
              value={pSearch}
              onChange={handlePSearch}
              placeholder="Search patient"
              required
              className="
                block w-full text-gray-dark placeholder-gray-base
                bg-white border border-gray-base rounded-lg
                px-4 py-2 hover:bg-accent-100/10
                focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
              "
            />
            {fPatients.length>0 && (
              <ul className="absolute z-20 bg-white border border-gray-base w-full mt-1 rounded-lg max-h-48 overflow-y-auto">
                {fPatients.map(p=>(
                  <li key={p._id}
                      onMouseDown={()=>selectPatient(p)}
                      className="px-4 py-2 hover:bg-accent-100/10 cursor-pointer">
                    {p.firstname} {p.lastname}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reason */}
          <input
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="Reason for visit"
            required
            className="
              block w-full text-gray-dark placeholder-gray-base
              bg-white border border-gray-base rounded-lg
              px-4 py-2
              hover:bg-accent-100/10
              focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
            "
          />

          {/* Doctor */}
          <select name="doctor" value={form.doctor} onChange={handleChange} required
                  className="
                    block w-full text-gray-dark
                    bg-white border border-gray-base rounded-lg
                    px-4 py-2
                    hover:bg-accent-100/10
                    focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
                  ">
            <option value="">Select Doctor</option>
            {doctors.map(d=>(
              <option key={d._id} value={d._id}>
                Dr. {d.firstName} {d.lastName}
              </option>
            ))}
          </select>

          {/* Clinic */}
          <select name="clinic" value={form.clinic} onChange={handleChange} required
                  className="
                    block w-full text-gray-dark
                    bg-white border border-gray-base rounded-lg
                    px-4 py-2
                    hover:bg-accent-100/10
                    focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
                  ">
            <option value="">Select Clinic</option>
            {clinics.map(c=>(
              <option key={c._id} value={c._id}>
                {c.name||c.nameaddress}
              </option>
            ))}
          </select>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <input type="date" name="date" value={form.date} onChange={handleChange} required
                   className="
                     block w-full text-gray-dark
                     bg-white border border-gray-base rounded-lg
                     px-4 py-2
                     hover:bg-accent-100/10
                     focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
                   " />
            <input type="time" name="time" value={form.time} onChange={handleChange} required
                   className="
                     block w-full text-gray-dark
                     bg-white border border-gray-base rounded-lg
                     px-4 py-2
                     hover:bg-accent-100/10
                     focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
                   " />
          </div>

          {/* Payment */}
          <div className="grid grid-cols-2 gap-4">
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required
                    className="
                      block w-full text-gray-dark
                      bg-white border border-gray-base rounded-lg
                      px-4 py-2
                      hover:bg-accent-100/10
                      focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
                    ">
              <option>Cash</option>
              <option>Insurance</option>
            </select>
            <input name="hmo" value={form.hmo} onChange={handleChange}
                   placeholder="HMO"
                   className="
                     block w-full text-gray-dark placeholder-gray-base
                     bg-white border border-gray-base rounded-lg
                     px-4 py-2
                     hover:bg-accent-100/10
                     focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
                   " />
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button type="submit"
                    className="
                      flex-1 bg-accent-100 text-on-accent
                      hover:bg-accent-200
                      focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2
                      font-semibold px-4 py-2 rounded-full
                    ">
              Save
            </button>
            <button type="button" onClick={clearForm}
                    className="
                      flex-1 bg-transparent border-2 border-red-500 text-red-600
                      hover:bg-red-50
                      focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2
                      font-medium px-4 py-2 rounded-full
                    ">
              Clear
            </button>
          </div>
        </form>

        {/* ── RIGHT: Appointments List ───────────────── */}
        <div className="w-full lg:w-3/5 bg-white p-6 rounded-lg shadow flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <input type="date" value={viewDate} onChange={e=>setViewDate(e.target.value)}
                   className="
                     block text-gray-dark
                     bg-white border border-gray-base rounded-lg
                     px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
                    cursor-pointer hover:bg-accent-100/10 rounded-full
                  " />
            <div className="flex space-x-4">
              <select value={locFil} onChange={e=>setLocFil(e.target.value)}
                      className="
                        block text-gray-dark
                        bg-white border border-gray-base 
                        cursor-pointer hover:bg-accent-100/10 rounded-full
                        px-4 py-2
                        focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
                      ">
                <option value="all">All Locations</option>
                {clinics.map(c=>(
                  <option key={c._id} value={c._1d}>
                    {c.name||c.nameaddress}
                  </option>
                ))}
              </select>
              <select value={statFil} onChange={e=>setStatFil(e.target.value)}
                      className="
                        block text-gray-dark
                        bg-white border border-gray-base 
                        cursor-pointer hover:bg-accent-100/10 rounded-full
                        px-4 py-2
                        focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-100
                      ">
                {statusOptions.filter(o=>o.value!=='all').map(o=>(
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <ul className="space-y-4 overflow-y-auto flex-1">
            {filtered.length===0
              ? <li className="p-6 text-center text-gray-base">No appointments for the day</li>
              : filtered.map(appt=>(
                  <li key={appt._id} className="p-6 border rounded-lg space-y-4 hover:bg-accent-100/10">
                    <div className="flex items-center justify-between">
                      <div onClick={()=>handleOpenVisit(appt)}
                           className="cursor-pointer text-lg font-bold uppercase text-gray-dark">
                        {appt.patient.lastname}, {appt.patient.firstname}
                      </div>
                      <div className="flex space-x-3">
                        <TimeBox label="APPT TIME" value={formatTime(appt.time)} />
                        <TimeBox label="STARTED"    value={formatISOTime(appt.started)} />
                        <TimeBox label="ENDED"      value={formatISOTime(appt.ended)} />
                        <TimeBox label="DURATION"   value={calcDuration(appt.started,appt.ended)} />
                      </div>
                      <select value={appt.status||'confirmed'} onChange={e=>updateStatus(appt._id,e.target.value)}
                              className="
                                bg-transparent border-2 border-accent-100 text-on-accent
                                hover:border-accent-200 hover:bg-accent-200/10
                                focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2
                                px-6 py-2 rounded-full
                              ">
                        {statusOptions.filter(o=>o.value!=='all').map(o=>(
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-8 text-gray-base pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <UserIcon size={20}/>
                        <span>Dr. {appt.doctor.firstName} {appt.doctor.lastName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileTextIcon size={20}/>
                        <span>{appt.purpose}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSignIcon size={20}/>
                        <span>
                          {appt.paymentMethod==='Insurance'
                            ? `Insurance: ${appt.hmo}`
                            : appt.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
}
