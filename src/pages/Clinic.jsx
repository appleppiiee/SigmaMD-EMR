// src/pages/Clinic.jsx
import "../css/Clinics.css";
import { FiSearch } from "react-icons/fi";
import { FaHospital, FaEdit } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

export default function Clinic() {
  const navigate = useNavigate();

  // Default form values
  const defaultValues = {
    name: "",
    nameaddress: "",
    mobileNo: "",
    phoneNo: "",
    remarks: "",
    doctorIDs: [],
    secretaryIDs: []
  };

  // React-Hook-Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }
  } = useForm({ defaultValues });

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
    flex-1 bg-accent-100 text-on-accent
    hover:bg-accent-200
    focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2
    font-semibold px-4 py-2 rounded-full
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

  // Load users for selects
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("/api/users")
      .then(r => setUsers(r.data))
      .catch(() => console.warn("Failed loading users"));
  }, []);

  // Clinics list
  const [clinics, setClinics]       = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId]         = useState(null);

  useEffect(() => {
    axios.get("/api/clinics")
      .then(r => setClinics(r.data))
      .catch(err => {
        console.error("Error fetching clinics:", err);
        setClinics([]);
      });
  }, []);

  const onSubmit = async data => {
    const payload = {
      name: data.name,
      nameaddress: data.nameaddress,
      mobileNo: data.mobileNo,
      phone: data.phoneNo,
      remarks: data.remarks,
      doctorIDs: data.doctorIDs.map(o => o.value),
      secretaryIDs: data.secretaryIDs.map(o => o.value)
    };

    try {
      let res;
      if (editId) {
        res = await axios.put(`/api/clinics/${editId}`, payload);
        setClinics(c => c.map(x => x._id === editId ? res.data : x));
      } else {
        res = await axios.post("/api/clinics", payload);
        setClinics(c => [...c, res.data]);
      }
      reset(defaultValues);
      setEditId(null);
    } catch (err) {
      console.error("Save failed:", err);
      alert(err.response?.data?.error || "Failed to save clinic");
    }
  };

  const handleEdit = c => {
    setEditId(c._id);
    setValue("name", c.name);
    setValue("nameaddress", c.nameaddress);
    setValue("mobileNo", c.mobileNo);
    setValue("phoneNo", c.phone);
    setValue("remarks", c.remarks);
    setValue(
      "doctorIDs",
      c.doctorIDs.map(u => ({ value: u._id, label: `${u.firstName} ${u.lastName}` }))
    );
    setValue(
      "secretaryIDs",
      c.secretaryIDs.map(u => ({ value: u._id, label: `${u.firstName} ${u.lastName}` }))
    );
  };

  if (clinics === null) return <div className="p-8">Loading…</div>;

  const filtered = clinics.filter(c =>
    (c.name + c.nameaddress).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const doctorOptions = users.filter(u => u.userType === "provider")
    .map(u => ({ value: u._id, label: `${u.firstName} ${u.lastName}` }));
  const secretaryOptions = users.filter(u => u.userType === "secretary")
    .map(u => ({ value: u._id, label: `${u.firstName} ${u.lastName}` }));

  return (
    <div className="flex p-3 h-full">
      <div className="w-full flex flex-col lg:flex-row gap-3">

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-2/5 bg-white p-6 rounded-lg shadow space-y-5 overflow-y-auto"
        >
          {/* Toggle Buttons */}
          <div className="space-x-4 mb-4">
            <button type="button" className={buttonPrimary}>
              Clinic
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings/user')}
              className={buttonSecondary}
            >
              Add User
            </button>
          </div>

          <input
            {...register("name", { required: true })}
            placeholder="Name"
            className={inputClass}
          />
          {errors.name && <p className="text-red-500 text-sm">Required</p>}

          <input
            {...register("nameaddress", { required: true })}
            placeholder="Address"
            className={inputClass}
          />
          {errors.nameaddress && <p className="text-red-500 text-sm">Required</p>}

          <input
            {...register("mobileNo")}
            placeholder="Mobile No"
            className={inputClass} 
          />
          <input
            {...register("phoneNo")}
            placeholder="Phone No"
            className={inputClass}
          />

          <Controller
            name="doctorIDs"
            control={control}
            rules={{ validate: v => v && v.length > 0 }}
            render={({ field }) => (
              <Select
                {...field}
                options={doctorOptions}
                isMulti
                placeholder="Select physicians"
                className="react-select-container hover:bg-accent-100/10"
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.doctorIDs && <p className="text-red-500 text-sm">Choose at least one</p>}

          <Controller
            name="secretaryIDs"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={secretaryOptions}
                isMulti
                placeholder="Select secretaries"
                className="react-select-container hover:bg-accent-100/10"
                classNamePrefix="react-select"
              />
            )}
          />

          <input
            {...register("remarks")}
            placeholder="Remarks"
            className={inputClass}
          />

          <div className="flex space-x-2">
            <button type="submit" className={saveBtn}>
              {editId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => { reset(defaultValues); setEditId(null); }}
              className={clearBtn}
            >
              Clear
            </button>
          </div>
        </form>

        {/* LIST */}
        <div className="w-full lg:w-3/5 bg-white p-6 rounded-lg shadow flex flex-col overflow-y-auto">
          <div className="mb-4 flex items-center gap-2">
            
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search clinic"
              className={`${inputClass} rounded`}
            />
          </div>

          <ul className="space-y-4 flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="text-center text-gray-base">No clinics found.</li>
            ) : (
              filtered.map(c => (
                <li
                  key={c._id}
                  className="p-4 border rounded-lg flex justify-between hover:bg-accent-100/10 cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-gray-dark">{c.name}</p>
                    <p className="text-gray-base">{c.nameaddress}</p>
                    <p className="text-gray-base">Doctors: {c.doctorIDs.map(u => `${u.firstName} ${u.lastName}`).join(", ")}</p>
                    {c.secretaryIDs.length > 0 && (
                      <p className="text-gray-base">
                        Secretaries: {c.secretaryIDs.map(u => `${u.firstName} ${u.lastName}`).join(", ")}
                      </p>
                    )}
                    <p className="text-gray-base">Phone: {c.phone}</p>
                    <p className="text-gray-base">Mobile: {c.mobileNo}</p>
                    <p className="text-gray-base">{c.remarks}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(c)}
                    className={editBtn}
                    aria-label="Edit clinic"
                  >
                    <FaEdit />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
