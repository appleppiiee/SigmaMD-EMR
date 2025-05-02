// src/pages/Appointments.jsx
import '../css/Appointments.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserIcon, FileTextIcon, DollarSignIcon } from 'lucide-react';

export default function Appointments() {
  const navigate = useNavigate();

  /* ───────────────────────── HELPERS ───────────────────────── */
  const calculateAge = dobString => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    const today = new Date();
    let y = today.getFullYear() - dob.getFullYear();
    let m = today.getMonth()  - dob.getMonth();
    let d = today.getDate()   - dob.getDate();
    if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return `${y}Y-${m}M-${d}D`;
  };

  const formatTime = str =>
    str
      ? new Date(`${new Date().toDateString()} ${str}`).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      : '--:--';

  const formatISOTime = iso =>
    iso
      ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '--:--';

  const formatDate = ds =>
    ds
      ? new Date(ds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '--';

  const TimeBox = ({ label, value }) => (
    <div className="flex flex-col items-center border rounded p-2 min-w-[80px]">
      <div className="text-xs font-semibold">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );

  const calcDuration = (startISO, endISO) => {
    if (!startISO || !endISO) return '--:--';
    const ms   = new Date(endISO) - new Date(startISO);
    const mins = Math.floor(ms / 60000);
    const h    = Math.floor(mins / 60);
    const m    = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  /* ───────────────────────── STATE ───────────────────────── */
  const now           = new Date();
  const defaultDate   = now.toISOString().slice(0, 10);
  const defaultTime   = now.toTimeString().slice(0, 5);

  const statusOptions = [
    { value: 'all',        label: 'All Status' },
    { value: 'confirmed',  label: 'Confirmed' },
    { value: 'completed',  label: 'Completed' },
    { value: 'noshow',     label: 'No Show'   },
    { value: 'cancelled',  label: 'Cancelled' },
    { value: 'followup',   label: 'Follow Up' }
  ];

  const defaultForm = {
    patient: '',
    doctor:  '',
    clinic:  '',
    purpose: '',
    date:    defaultDate,
    time:    defaultTime,
    paymentMethod: 'Cash',
    hmo: ''
  };

  const [appointments,setAppointments] = useState([]);
  const [patients,    setPatients]     = useState([]);
  const [doctors,     setDoctors]      = useState([]);
  const [clinics,     setClinics]      = useState([]);
  const [form,        setForm]         = useState(defaultForm);

  const [viewDate,setViewDate] = useState(defaultDate);
  const [locFil,  setLocFil]   = useState('all');
  const [statFil, setStatFil]  = useState('all');

  const [pSearch,setPSearch] = useState('');
  const [fPatients,setFP]    = useState([]);
  const patientRef = useRef();

  /* ─────────────────── LOAD INITIAL DATA ─────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const [aRes, pRes, uRes, cRes] = await Promise.all([
          axios.get('/api/appointments'),
          axios.get('/api/patients'),
          axios.get('/api/users'),
          axios.get('/api/clinics')
        ]);
        setAppointments(Array.isArray(aRes.data) ? aRes.data : []);
        setPatients(pRes.data || []);
        setDoctors((uRes.data || []).filter(u => u.userType === 'provider'));
        setClinics(cRes.data || []);
      } catch (err) {
        console.error(err);
        alert('Failed loading data');
      }
    })();
  }, []);

  /* ─────────────────── FORM HANDLERS ─────────────────── */
  const handleChange  = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePSearch = e => {
    const t = e.target.value;
    setPSearch(t);
    setForm(f => ({ ...f, patient: '' }));
    if (!t.trim()) return setFP([]);
    setFP(
      patients.filter(p =>
        `${p.firstname} ${p.lastname}`.toLowerCase().includes(t.toLowerCase())
      )
    );
  };
  const selectPatient = p => {
    setForm(f => ({ ...f, patient: p._id }));
    setPSearch(`${p.firstname} ${p.lastname}`);
    setFP([]);
  };
  const clearForm    = () => { setForm(defaultForm); setPSearch(''); };

  /* ─────────────────── CREATE APPOINTMENT (+ bare panel) ─────────────────── */
  const addAppointment = async e => {
    e.preventDefault();
    try {
      const { data: appt } = await axios.post('/api/appointments', { ...form });
      setAppointments(a => [...a, appt]);
      clearForm();
      alert('Appointment created ✅');

      // create bare sigmapanel (fire & forget)
      axios.post('/api/sigmapanels', {
        appointmentID: appt._id,
        patientID:     appt.patient._id,
        doctorID:      appt.doctor._id
      }).catch(err => console.error('bare panel:', err));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not create appointment');
    }
  };

  /* ─────────────────── STATUS UPDATE ─────────────────── */
  const updateStatus = async (id,newStatus) => {
    try {
      const { data } = await axios.put(`/api/appointments/${id}`,{ status:newStatus });
      setAppointments(a => a.map(x => x._id===id ? { ...x, status:data.status } : x));
    } catch (err) {
      console.error(err);
      alert('Could not update status');
    }
  };

  /* ─────────────────── OPEN VISIT (mark started) ─────────────────── */
  const handleOpenVisit = async appt => {
    let startedISO = appt.started;
    try {
      if (!startedISO) {
        startedISO = new Date().toISOString();
        await axios.put(`/api/appointments/${appt._id}`,{ started: startedISO });
        setAppointments(a => a.map(x => x._id===appt._id ? { ...x, started: startedISO } : x));
      }
    } catch (err) {
      // if the call fails we still let the user in, but log it
      console.error('start visit error:', err);
    }

    navigate('/sigmapanel',{
      state:{
        appointmentId: appt._id,
        patientId:     appt.patient._id,
        doctorId:      appt.doctor._id,
        patientName:   `${appt.patient.lastname}, ${appt.patient.firstname}`,
        patientAge:    calculateAge(appt.patient.dob),
        patientSex:    appt.patient.sex,
        appointmentDate: formatDate(appt.date),
        appointmentTime: formatTime(appt.time),
        clinicName:    appt.clinic.name || appt.clinic.nameaddress,
        clinicId:     appt.clinic._id
      }
    });
  };

  /* ─────────────────── FILTER LIST ─────────────────── */
  const filtered = appointments
    .filter(a => {
      if (!a.date) return false;
      return new Date(a.date).toISOString().slice(0,10) === viewDate;
    })
    .filter(a => locFil === 'all' ? true : a.clinic?._id === locFil)
    .filter(a => statFil === 'all' ? true : (a.status || 'confirmed') === statFil);

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="flex p-3">
      <div className="w-full flex flex-col lg:flex-row gap-3" style={{ height:'calc(100vh - 4rem)' }}>
        {/* ───────────── LEFT FORM ───────────── */}
        <form onSubmit={addAppointment} className="w-full lg:w-2/5 bg-white p-4 rounded shadow flex flex-col overflow-y-auto">
          {/* patient search */}
          <div className="relative mb-3">
            <input
              ref={patientRef}
              type="text"
              value={pSearch}
              onChange={handlePSearch}
              placeholder="Search patient"
              className="border p-2 w-full"
              required
            />
            {fPatients.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto">
                {fPatients.map(p => (
                  <li key={p._id} onMouseDown={()=>selectPatient(p)} className="p-2 hover:bg-gray-100 cursor-pointer">
                    {p.firstname} {p.lastname}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="Reason for visit"
            className="border p-2 mb-3"
            required
          />

          <select name="doctor" value={form.doctor} onChange={handleChange} className="border p-2 mb-3" required>
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d._id} value={d._id}>
                Dr.&nbsp;{d.firstName} {d.lastName}
              </option>
            ))}
          </select>

          <select name="clinic" value={form.clinic} onChange={handleChange} className="border p-2 mb-3" required>
            <option value="">Select Clinic</option>
            {clinics.map(c => (
              <option key={c._id} value={c._id}>
                {c.name || c.nameaddress}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2" required />
            <input type="time" name="time" value={form.time} onChange={handleChange} className="border p-2" required />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="border p-2" required>
              <option>Cash</option>
              <option>Insurance</option>
            </select>
            <input name="hmo" value={form.hmo} onChange={handleChange} placeholder="HMO" className="border p-2" />
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded-full">Save</button>
            <button type="button" onClick={clearForm} className="flex-1 border border-red-500 text-red-500 px-4 py-2 rounded-full">Clear</button>
          </div>
        </form>

        {/* ───────────── RIGHT LIST ───────────── */}
        <div className="w-full lg:w-3/5 bg-white p-4 rounded shadow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <input type="date" value={viewDate} onChange={e=>setViewDate(e.target.value)} className="text-sm p-2" />
            <div className="flex space-x-3">
              <select value={locFil} onChange={e=>setLocFil(e.target.value)} className="px-4 py-1 rounded-full border text-sm">
                <option value="all">All Locations</option>
                {clinics.map(c => (
                  <option key={c._id} value={c._id}>{c.name || c.nameaddress}</option>
                ))}
              </select>
              <select value={statFil} onChange={e=>setStatFil(e.target.value)} className="px-4 py-1 rounded-full border text-sm">
                {statusOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <ul className="space-y-2 overflow-y-auto flex-1">
            {filtered.map(appt => {
              const tA = formatTime(appt.time);
              const tS = formatISOTime(appt.started);
              const tE = formatISOTime(appt.ended);
              const dur = calcDuration(appt.started, appt.ended);
              return (
                <li key={appt._id} className="flex flex-col p-4 border rounded space-y-3">
                  <div className="flex items-center justify-between">
                    {/* clickable patient name */}
                    <div
                      className="text-lg font-bold uppercase cursor-pointer"
                      onClick={() => handleOpenVisit(appt)}
                    >
                      <div>{appt.patient.lastname},</div>
                      <div>{appt.patient.firstname}</div>
                    </div>

                    <div className="flex space-x-2">
                      <TimeBox label="APPT TIME" value={tA} />
                      <TimeBox label="STARTED"   value={tS} />
                      <TimeBox label="ENDED"     value={tE} />
                      <TimeBox label="DURATION"  value={dur} />
                    </div>

                    <select
                      value={appt.status || 'confirmed'}
                      onChange={e => updateStatus(appt._id,e.target.value)}
                      className="px-3 py-1 rounded-full border text-sm"
                    >
                      {statusOptions.filter(o => o.value!=='all').map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-6 text-gray-600 pt-2 border-t">
                    <div className="flex items-center space-x-1">
                      <UserIcon size={16}/>
                      <span>Dr.&nbsp;{appt.doctor.firstName} {appt.doctor.lastName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileTextIcon size={16}/>
                      <span>{appt.purpose}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSignIcon size={16}/>
                      <span>
                        {appt.paymentMethod === 'Insurance'
                          ? `Insurance: ${appt.hmo}`
                          : appt.paymentMethod}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
