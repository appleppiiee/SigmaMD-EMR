import "../css/Patients.css";  
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
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
  });
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch patients once
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

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // When user clicks "Edit", populate form with that patient's data
  const handleEdit = patient => {
    setFormData({
      firstname: patient.firstname || '',
      middlename: patient.middlename || '',
      lastname: patient.lastname || '',
      mobile: patient.mobile || '',
      emailAddress: patient.emailAddress || '',
      dob: patient.dob ? patient.dob.substring(0, 10) : '',
      sex: patient.sex || '',
      remarks: patient.remarks || '',
      maritalStatus: patient.maritalStatus || '',
      bloodType: patient.bloodType || '',
      address: patient.address || ''
    });
    setEditId(patient._id);
  };

  // Add or update patient on form submit
  const addOrUpdatePatient = async e => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editId) {
        const res = await axios.put(`/api/patients/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(prev => prev.map(p => p._id === editId ? res.data : p));
        setEditId(null);
      } else {
        const res = await axios.post('/api/patients', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(prev => [...prev, res.data]);
      }
      // Reset form
      setFormData({
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
      });
    } catch (err) {
      console.error('Failed to submit patient:', err.response?.data || err.message);
      alert('Failed to add patient. Please check required fields.');
    }
  };

  // Filtered list for search
  const filtered = patients.filter(p =>
    `${p.lastname} ${p.firstname} ${p.middlename}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <div className="main-content w-full patients">
        {/* Full‐height container minus Topbar height */}
        <div
          className="flex flex-col lg:flex-row gap-6 p-6"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          {/* Add/Edit Patient Form */}
          <form
            onSubmit={addOrUpdatePatient}
            className="w-full lg:w-1/2 bg-white p-6 rounded shadow flex flex-col overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">
              {editId ? "EDIT PATIENT" : "ADD PATIENT"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="firstname"
                placeholder="Enter First Name"
                value={formData.firstname}
                onChange={handleChange}
                className="border p-2"
                required
              />

              <input
                name="middlename"
                placeholder="Enter Middle Name"
                value={formData.middlename}
                onChange={handleChange}
                className="border p-2"
              />

              <input
                name="lastname"
                placeholder="Enter Last Name"
                value={formData.lastname}
                onChange={handleChange}
                className="border p-2"
                required
              />

              <input
                name="mobile"
                placeholder="Enter Mobile No"
                value={formData.mobile}
                onChange={handleChange}
                className="border p-2"
              />

              <input
                name="emailAddress"
                type="email"
                placeholder="Email Address"
                value={formData.emailAddress}
                onChange={handleChange}
                className="border p-2"
              />

              <input
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="border p-2"
              />

              {/* NEW Sex Field */}
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>

              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="border p-2"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <textarea
              name="address"
              placeholder="Enter Complete Address"
              value={formData.address}
              onChange={handleChange}
              className="border p-2 w-full mt-4 flex-shrink-0"
            />

            <input
              name="remarks"
              placeholder="Enter Remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="border p-2 w-full mt-3 flex-shrink-0"
            />

            <button
              type="submit"
              className="bg-[rgb(181 205 57 / var(--tw-text-opacity, 1))]  text-white w-full py-3 rounded mt-4
                         hover:bg-[#1daf06] transition flex-shrink-0"
            >
              {editId ? "Update Patient" : "Add Patient"}
            </button>
          </form>

          {/* Patient List */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded shadow flex flex-col overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">PATIENT LIST</h2>

            <div className="mb-4 flex-shrink-0">
              <label className="block font-medium mb-1">Filter Patients</label>
              <input
                className="border p-2 w-full"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Scrollable list */}
            <div className="space-y-4 flex-1 overflow-y-auto">
              {filtered.length === 0 && <p>No patients found.</p>}

              {filtered.map(patient => (
                <div
                  key={patient._id}
                  className="flex items-start bg-gray-50 p-4 rounded justify-between"
                >
                  <div className="flex items-start gap-4">
                    <FaUserCircle size={30} className="text-gray-400 mt-1" />
                    <div>
                      <p className="font-bold">
                        {patient.lastname}, {patient.firstname} {patient.middlename}
                      </p>
                      <p className="text-sm text-gray-600">
                        {patient.mobile || 'Mobile Number'} &nbsp;|&nbsp;
                        {patient.dob?.substring(0, 10) || 'Date Of Birth'} &nbsp;|&nbsp;
                        {patient.sex || 'N/A'} 
                        {/* {patient.remarks || 'Remarks'} */}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(patient)}
                    className="text-accent text-lg font-bold hover:text-accent-hover" 
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
