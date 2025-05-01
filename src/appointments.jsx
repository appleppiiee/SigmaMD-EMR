import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/DashboardTopbar.jsx';

export default function Appointment() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({
    patient: '', doctor: '', purpose: '', date: '',
    time: '', paymentMethod: '', hmo: '', clinic: ''
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('/api/appointments')
      .then(res => setAppointments(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAppointments([]));

    axios.get('/api/patients').then(r => setPatients(r.data)).catch(() => setPatients([]));
    axios.get('/api/users')
      .then(r => setDoctors(r.data.filter(u => u.userType === 'provider')))
      .catch(() => setDoctors([]));
    axios.get('/api/clinics').then(r => setClinics(r.data)).catch(() => setClinics([]));
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addAppointment = async e => {
    e.preventDefault();
    const datetime = new Date(`${form.date}T${form.time}`);
    const data = { ...form, datetime };
    try {
      const res = await axios.post('/api/appointments', data);
      if (res.data._id) {
        setAppointments(prev => [...prev, res.data]);
        setForm({ patient: '', doctor: '', purpose: '', date: '', time: '', paymentMethod: '', hmo: '', clinic: '' });
      }
    } catch (err) {
      console.error('Failed to add appointment', err);
    }
  };

  const deleteAppointment = async id => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const filtered = appointments.filter(appt =>
    `${appt.patient?.firstname || ''} ${appt.patient?.lastname || ''}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content w-full">
        <Topbar />

        {/* full-height container minus Topbar (adjust 4rem to your Topbar height) */}
        <div
          className="flex flex-col lg:flex-row gap-6 p-6"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          {/* ADD APPOINTMENT FORM */}
          <form
            onSubmit={addAppointment}
            className="w-full lg:w-1/2 bg-white p-6 rounded shadow
                       flex flex-col overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-3 text-center">
              ADD APPOINTMENT
            </h2>

            <select
              name="patient"
              value={form.patient}
              onChange={handleChange}
              className="border p-2 mb-3 w-full flex-shrink-0"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>
                  {p.firstname} {p.lastname}
                </option>
              ))}
            </select>

            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              className="border p-2 mb-3 w-full flex-shrink-0"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>
                  Dr. {d.firstName} {d.lastName}
                </option>
              ))}
            </select>

            <input
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder="Enter Purpose"
              className="border p-2 mb-3 w-full flex-shrink-0"
              required
            />

            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="border p-2 mb-3 w-full"
                required
              />
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="border p-2 mb-3 w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="border p-2 mb-3 w-full"
                required
              >
                <option value="">Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Insurance">Insurance</option>
                <option value="Card">Card</option>
              </select>
              <input
                name="hmo"
                value={form.hmo}
                onChange={handleChange}
                placeholder="Enter HMO"
                className="border p-2 mb-3 w-full"
              />
            </div>

            <select
              name="clinic"
              value={form.clinic}
              onChange={handleChange}
              className="border p-2 mb-3 w-full flex-shrink-0"
              required
            >
              <option value="">Select Clinic</option>
              {clinics.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name || c.nameaddress}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full flex-shrink-0"
            >
              Add Appointment
            </button>
          </form>

          {/* APPOINTMENT LIST */}
          <div
            className="w-full lg:w-1/2 bg-white p-6 rounded shadow
                       flex flex-col overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-3">
              Appointments
            </h2>

            <input
              className="border p-2 mb-3 w-full flex-shrink-0"
              placeholder="Search..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />

            {/* inner list scroll area */}
            <ul className="flex-1 overflow-y-auto space-y-2">
              {filtered.map(appt => {
                const patientName = `${appt.patient?.firstname || ''} ${appt.patient?.lastname || ''}`;
                const checkinDate = new Date(appt.datetime).toLocaleDateString();
                const checkinTime = new Date(appt.datetime).toLocaleTimeString();

                return (
                  <li
                    key={appt._id}
                    onClick={() =>
                      navigate('/sigmapanel', {
                        state: {
                          appointmentId: appt._id,
                          patientId: appt.patient?._id,
                          patientName,
                          checkinDate,
                          checkinTime,
                          paymentMethod: appt.paymentMethod
                        }
                      })
                    }
                    className="bg-gray-50 p-3 rounded shadow-sm cursor-pointer hover:bg-gray-100"
                  >
                    <div className="mb-2">
                      <p className="font-medium">
                        {patientName} with Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Time {checkinTime} | Date {checkinDate}
                      </p>
                      <p className="text-sm text-gray-600">
                        {/* Clinic{' '} */}
                        {typeof appt.clinic === 'object'
                          ? (appt.clinic?.name || appt.clinic?.nameaddress)
                          : ' •'} {appt.paymentMethod} • HMO: {appt.hmo} • Purpose {appt.purpose}
                      </p>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deleteAppointment(appt._id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Cancel
                    </button>
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
