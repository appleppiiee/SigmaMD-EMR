// src/pages/Users.jsx
import "../css/Users.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { FaUserCircle, FaEdit } from "react-icons/fa";

export default function Users() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const [users,    setUsers]    = useState([]);
  const [clinics,  setClinics]  = useState([]);
  const [search,   setSearch]   = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editId,   setEditId]   = useState(null);

  const inputClass = `
    block w-full text-gray-dark placeholder-gray-base
    bg-white border border-gray-base rounded-lg
    px-4 py-2
    hover:bg-accent-100/10
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-200
  `.trim().replace(/\s+/g, ' ');
  const buttonPrimary = `
    bg-accent-200 text-on-accent
    hover:bg-accent-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-300
    font-medium px-5 py-2 rounded-full
  `.trim().replace(/\s+/g, ' ');
  const buttonSecondary = `
    border-2 border-accent-100 text-on-accent bg-transparent
    hover:bg-accent-100/10
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-300
    font-medium px-5 py-2 rounded-full
  `.trim().replace(/\s+/g, ' ');
  const saveBtn = `
    flex-1 bg-accent-100 text-on-accent
    hover:bg-accent-200
    focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2
    font-semibold px-4 py-2 rounded-full
  `.trim().replace(/\s+/g, ' ');
  const clearBtn = `
    flex-1 bg-transparent border-2 border-red-500 text-red-600
    hover:bg-red-50
    focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2
    font-medium px-4 py-2 rounded-full
  `.trim().replace(/\s+/g, ' ');
  const editBtn = `
    text-accent-100 hover:text-accent-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-200
    text-lg font-bold
  `.trim().replace(/\s+/g, ' ');

  const hydrateClinic = rawUser => {
    const clinic = clinics.find(c => c._id === rawUser.clinicID);
    return { ...rawUser, clinicID: clinic || null };
  };

  useEffect(() => {
    axios
      .get("/api/clinics", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setClinics(res.data))
      .catch(() => alert("Failed to load clinics"));

    axios
      .get("/api/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data.map(hydrateClinic)))
      .catch(() => alert("Failed to load users"));
  }, [token]);

  const onSubmit = async data => {
    try {
      const payload = editId ? data : { ...data, password: "password123" };
      let res;
      if (editId) {
        res = await axios.put(`/api/users/${editId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(us => us.map(u => u._id === editId ? hydrateClinic(res.data) : u));
      } else {
        res = await axios.post("/api/users", payload, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(us => [...us, hydrateClinic(res.data)]);
      }
      reset();
      setEditId(null);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      alert(msg.includes("duplicate key") ? "Email already exists." : "Save failed.");
    }
  };

  const handleEdit = u => {
    setEditId(u._id);
    ["firstName","middleName","lastName","dob","mobileNo","email","userType","doctorType","specialization","clinicID","availability","remarks"]
      .forEach(field => setValue(field, field==="dob" ? u.dob?.slice(0,10) : u[field] || ""));
  };

  // apply search and role filter
  const filtered = users.filter(u => {
    const matchName = `${u.lastName} ${u.firstName}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.userType === roleFilter;
    return matchName && matchRole;
  });

  const isEditing = Boolean(editId);

  return (
    <div className="flex h-full p-3">
      <div className="w-full flex flex-col lg:flex-row gap-3">

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}
              className="w-full bg-white p-6 rounded-lg shadow space-y-5 overflow-y-auto">
          <div className="space-x-4 mb-4">
            <button type="button" className={buttonPrimary}>User</button>
            <button type="button" onClick={() => navigate("/settings/clinic")} className={buttonSecondary}>Add Clinic</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input {...register("firstName",{ required: "Required" })} placeholder="First Name" className={inputClass}/>
              {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
            </div>
            <input {...register("middleName")} placeholder="Middle Name" className={inputClass}/>
            <div>
              <input {...register("lastName",{ required: "Required" })} placeholder="Last Name" className={inputClass}/>
              {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
            </div>
            <div>
              <input type="date" {...register("dob",{ required: "Required" })} className={inputClass}/>
              {errors.dob && <span className="text-red-500 text-sm">{errors.dob.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input {...register("mobileNo",{ required: "Required" })} placeholder="Mobile" className={inputClass}/>
              {errors.mobileNo && <span className="text-red-500 text-sm">{errors.mobileNo.message}</span>}
            </div>
            <div>
              <input {...register("email",{ required: "Required" })} placeholder="Email" className={inputClass}/>
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <select {...register("userType",{ required: "Required" })} className={inputClass}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="physician">Physician</option>
                <option value="secretary">Secretary</option>
              </select>
              {errors.userType && <span className="text-red-500 text-sm">{errors.userType.message}</span>}
            </div>
            <input {...register("doctorType",{ required: "Required" })} placeholder="Practice" className={inputClass}/>
            {errors.doctorType && <span className="text-red-500 text-sm col-span-2">{errors.doctorType.message}</span>}
            <input {...register("specialization",{ required: "Required" })} placeholder="Specialization" className={inputClass}/>
            {errors.specialization && <span className="text-red-500 text-sm col-span-2">{errors.specialization.message}</span>}
            <div>
              <select {...register("clinicID",{ required: "Required" })} className={inputClass}>
                <option value="">Select Clinic</option>
                {clinics.map(c => <option key={c._id} value={c._id}>{c.name||c.nameaddress}</option>)}
              </select>
              {errors.clinicID && <span className="text-red-500 text-sm">{errors.clinicID.message}</span>}
            </div>
            <input {...register("availability",{ required: "Required" })} placeholder="Availability" className={inputClass}/>
            {errors.availability && <span className="text-red-500 text-sm col-span-2">{errors.availability.message}</span>}
            <textarea {...register("remarks")} placeholder="Remarks" className={`${inputClass} col-span-2`} />
          </div>

          <div className="flex gap-3">
            <button type="submit" className={saveBtn}>{isEditing ? "Update" : "Save"}</button>
            <button type="button" onClick={() => { reset(); setEditId(null); }} className={clearBtn}>Clear</button>
          </div>
        </form>

        {/* List & Filters */}
        <div className="w-full bg-white p-6 rounded-lg shadow flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            {/* <FiSearch className="text-gray-base" /> */}
            <input
              className={inputClass}
              placeholder="Search User"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className={inputClass + " w-48 ml-2"}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="physician">Physician</option>
              <option value="secretary">Secretary</option>
            </select>
          </div>

          <ul className="space-y-4 overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <li className="text-center text-gray-base">No users found.</li>
            ) : filtered.map(u => (
              <li key={u._id} className="p-4 border rounded-lg flex justify-between hover:bg-accent-100/10 cursor-pointer">
                <div className="flex items-center gap-4">
                  <FaUserCircle size={30} className="text-gray-base" />
                  <div>
                    <p className="font-bold text-gray-dark">{u.lastName}, {u.firstName} {u.middleName}</p>
                    <p className="text-sm text-gray-base">
                      {u.mobileNo} | {u.email} | {u.userType}
                    </p>
                    {u.doctorType && <p>Practice: {u.doctorType}</p>}
                    {u.specialization && <p className="text-sm text-gray-base">Specialization: {u.specialization}</p>}
                    {u.availability  && <p className="text-sm text-gray-base">Availability: {u.availability}</p>}
                    {u.clinicID     && <p className="text-sm text-gray-base">Clinic: {u.clinicID.name||u.clinicID.nameaddress}</p>}
                  </div>
                </div>
                <button onClick={() => handleEdit(u)} className={editBtn} aria-label="Edit user">
                  <FaEdit />
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
