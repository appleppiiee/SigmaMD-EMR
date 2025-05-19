// src/pages/Patients.jsx
import "../css/Patients.css";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

export default function Patient() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const defaultForm = {
    firstname: '',
    middlename: '',
    lastname: '',
    mobile: '',
    emailAddress: '',
    dob: '',
    sex: '',
    remarks: '',
    maritalStatus: '',
    bloodType: '',
    address: ''
  };

  const [formData, setFormData] = useState(defaultForm);
  const [search,   setSearch]   = useState('');
  const [editId,   setEditId]   = useState(null);
  const token = localStorage.getItem('token');

  // WCAG-friendly classes
  const inputClass = `
    block w-full text-gray-dark placeholder-gray-base
    bg-white border border-gray-base rounded-lg
    px-4 py-2
    hover:bg-accent-100/10
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-200
  `.trim().replace(/\s+/g,' ');
  const buttonPrimary = `
    bg-accent-200 text-on-accent
    hover:bg-accent-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-300
    font-medium px-5 py-2 rounded-full
  `.trim().replace(/\s+/g,' ');
  const buttonSecondary = `
    border-2 border-accent-100 text-on-accent bg-transparent
    hover:bg-accent-100/10
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-300
    font-medium px-5 py-2 rounded-full
  `.trim().replace(/\s+/g,' ');
  const saveBtn = `
    flex-1
    bg-accent-100 hover:bg-accent-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-300
    text-on-accent font-semibold px-4 py-2 rounded-full
  `.trim().replace(/\s+/g,' ');
  const clearBtn = `
    flex-1 bg-transparent border-2 border-red-500 text-red-600
    hover:bg-red-50
    focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2
    font-medium px-4 py-2 rounded-full
  `.trim().replace(/\s+/g,' ');
  const editBtn = `
    text-accent-100 hover:text-accent-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-200
    text-lg font-bold
  `.trim().replace(/\s+/g,' ');

  // Fetch patients
  useEffect(() => {
    axios.get('/api/patients', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPatients(Array.isArray(res.data) ? res.data : []))
    .catch(err => {
      console.error('Error fetching patients:', err);
      setPatients([]);
    });
  }, []);

  const clearForm = () => {
    setFormData(defaultForm);
    setEditId(null);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = patient => {
    setFormData({
      firstname:     patient.firstname || '',
      middlename:    patient.middlename || '',
      lastname:      patient.lastname || '',
      mobile:        patient.mobile || '',
      emailAddress:  patient.emailAddress || '',
      dob:           patient.dob?.substring(0,10) || '',
      sex:           patient.sex || '',
      remarks:       patient.remarks || '',
      maritalStatus: patient.maritalStatus || '',
      bloodType:     patient.bloodType || '',
      address:       patient.address || ''
    });
    setEditId(patient._id);
  };

  const addOrUpdatePatient = async e => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editId) {
        const res = await axios.put(`/api/patients/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(prev => prev.map(p => p._id === editId ? res.data : p));
      } else {
        const res = await axios.post('/api/patients', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(prev => [...prev, res.data]);
      }
      clearForm();
    } catch (err) {
      console.error('Failed to submit patient:', err);
      alert('Failed to add patient. Please check required fields.');
    }
  };

  const filtered = patients.filter(p =>
    `${p.lastname} ${p.firstname} ${p.middlename}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full p-3">
      <div className="w-full flex flex-col lg:flex-row gap-3">
        {/* Left: Form */}
        <form
          onSubmit={addOrUpdatePatient}
          className="w-full  bg-white p-6 rounded-lg shadow space-y-5 overflow-y-auto"
        >
          <div className="space-x-4 mb-4">
            <button type="button" className={buttonPrimary}>
              Patient
            </button>
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className={buttonSecondary}
            >
              Add Appointment
            </button>
          </div>

         

          <div className="grid grid-cols-2 gap-3">
            <input
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              className={inputClass}
              required
            />
            <input
              name="middlename"
              placeholder="Middle Name"
              value={formData.middlename}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              className={inputClass}
              required
            />
            <input
              name="mobile"
              placeholder="Mobile No"
              value={formData.mobile}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="emailAddress"
              type="email"
              placeholder="Email Address"
              value={formData.emailAddress}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className={inputClass}
            />
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Marital Status</option>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Blood Type</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className={`${inputClass} `}
          />

          <textarea
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
            className={`${inputClass} `}
          />

          <div className="flex space-x-2">
            <button type="submit" className={saveBtn}>
              Save
            </button>
            <button type="button" onClick={clearForm} className={clearBtn}>
              Clear
            </button>
          </div>
        </form>

        {/* Right: List */}
        <div className="w-full  bg-white p-6 rounded-lg shadow flex flex-col">
          <input
            className={`${inputClass} mb-4`}
            placeholder="Search Patient"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <ul className="space-y-4 overflow-y-auto flex-1">
            {filtered.length === 0
              ? <li className="text-center text-gray-base">No patients found.</li>
              : filtered.map(p => (
                <li
                  key={p._id}
                  className="p-4 border rounded-lg flex justify-between items-center hover:bg-accent-100/10 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <FaUserCircle size={30} className="text-gray-base" />
                    <div>
                      <p className="font-bold text-gray-dark">
                        {p.lastname}, {p.firstname} {p.middlename}
                      </p>
                      <p className="text-sm text-gray-base">
                        {p.mobile || 'N/A'} &nbsp;|&nbsp; {p.dob?.substring(0,10) || 'DOB'} &nbsp;|&nbsp; {p.sex || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(p)}
                    className={editBtn}
                    aria-label="Edit patient"
                  >
                    <FaEdit />
                  </button>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
}
