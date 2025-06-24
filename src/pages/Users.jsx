// src/pages/Users.jsx

import "../css/Users.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { FaUserCircle, FaEdit } from "react-icons/fa";

/**
 * Users page component: displays a form to create/edit users and a list of existing users.
 * Fetches clinics and users from the API, allows searching, and handles create/update operations.
 */
export default function Users() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // JWT token for API calls

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  // Local state for users, clinics, search term, and currently edited user ID
  const [users, setUsers] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // WCAG-friendly Tailwind CSS utility classes
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

  /**
   * Maps a raw user object to include the full clinic object instead of just clinicID.
   * @param {Object} rawUser - The user object returned by the API.
   * @returns {Object} - The user object with clinicID replaced by the matching clinic object.
   */
  const hydrateClinic = rawUser => {
    const clinic = clinics.find(c => c._id === rawUser.clinicID);
    return { ...rawUser, clinicID: clinic || null };
  };

  /**
   * Fetch clinics and users from the API when the component mounts or when the token changes.
   * Clinics are fetched first so that users can be hydrated with clinic details.
   */
  useEffect(() => {
    // Fetch clinics
    axios
      .get("/api/clinics", { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setClinics(response.data);
      })
      .catch(error => {
        console.error("Error fetching clinics:", error);
        alert("Failed to load clinics. Please try again later.");
      });

    // Fetch users and attach clinic details
    axios
      .get("/api/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        const rawUsers = response.data;
        const hydratedUsers = rawUsers.map(hydrateClinic);
        setUsers(hydratedUsers);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        alert("Failed to load users. Please try again later.");
      });
  }, [token]);

  /**
   * Handle form submission for creating or updating a user.
   * If editId is set, performs an update; otherwise, creates a new user with a default password.
   * @param {Object} data - The form data.
   */
  const onSubmit = async data => {
    try {
      const { _id, ...rest } = data;
      // If editing, payload is rest; if creating, include a default password
      const payload = editId
        ? rest
        : { ...rest, password: "password123" };

      let response;
      if (editId) {
        // Update existing user
        response = await axios.put(
          `/api/users/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update state to reflect changes
        setUsers(currentUsers =>
          currentUsers.map(u =>
            u._id === editId ? hydrateClinic(response.data) : u
          )
        );
      } else {
        // Create new user
        response = await axios.post(
          "/api/users",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Append new user to list
        setUsers(currentUsers => [
          ...currentUsers,
          hydrateClinic(response.data)
        ]);
      }

      // Reset form and exit editing mode
      reset();
      setEditId(null);
    } catch (err) {
      console.error("Failed to save user:", err);
      const apiError = err.response?.data?.error || err.message;
      // Show friendlier message if duplicate email
      if (apiError.includes("duplicate key")) {
        alert("A user with this email already exists.");
      } else {
        alert("Save failed. Please check form fields and try again.");
      }
    }
  };

  /**
   * Populate the form fields with the selected user's data for editing.
   * @param {Object} user - The user object to edit.
   */
  const handleEdit = user => {
    setEditId(user._id);
    setValue("firstName", user.firstName);
    setValue("middleName", user.middleName);
    setValue("lastName", user.lastName);
    setValue("dob", user.dob?.slice(0, 10)); // Format date for input[type="date"]
    setValue("mobileNo", user.mobileNo);
    setValue("email", user.email);
    setValue("userType", user.userType);
    setValue("doctorType", user.doctorType);
    setValue("specialization", user.specialization);
    setValue("clinicID", user.clinicID?._id);
    setValue("availability", user.availability);
    setValue("remarks", user.remarks);
  };

  // Filter users by search term (lastName firstName)
  const filtered = users.filter(u =>
    `${u.lastName} ${u.firstName}`.toLowerCase().includes(search.toLowerCase())
  );

  const isEditing = Boolean(editId);

  return (
    <div className="flex h-full p-3">
      <div className="w-full flex flex-col lg:flex-row gap-3">

        {/* User Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-white p-6 rounded-lg shadow space-y-5 overflow-y-auto"
        >
          <div className="space-x-4 mb-4">
            {/* Static buttons to indicate current tab or navigate */}
            <button type="button" className={buttonPrimary}>
              User
            </button>
            <button
              type="button"
              onClick={() => navigate("/settings/clinic")}
              className={buttonSecondary}
            >
              Add Clinic
            </button>
          </div>

          {/* Name and Date of Birth Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                {...register("firstName", { required: "First name is required" })}
                placeholder="First Name"
                className={inputClass}
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <input
              {...register("middleName")}
              placeholder="Middle Name"
              className={inputClass}
            />
            <div>
              <input
                {...register("lastName", { required: "Last name is required" })}
                placeholder="Last Name"
                className={inputClass}
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </div>
            <div>
              <input
                type="date"
                {...register("dob", { required: "Date of birth is required" })}
                className={inputClass}
              />
              {errors.dob && (
                <span className="text-red-500 text-sm">
                  {errors.dob.message}
                </span>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                {...register("mobileNo", { required: "Mobile number is required" })}
                placeholder="Mobile"
                className={inputClass}
              />
              {errors.mobileNo && (
                <span className="text-red-500 text-sm">
                  {errors.mobileNo.message}
                </span>
              )}
            </div>
            <div>
              <input
                {...register("email", { required: "Email address is required" })}
                placeholder="Email Address"
                className={inputClass}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* Role, Practice, Specialization, Clinic Selection, Availability, and Remarks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <select
                {...register("userType", { required: "User role is required" })}
                className={inputClass}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="physician">Physician</option>
                <option value="secretary">Secretary</option>
              </select>
              {errors.userType && (
                <span className="text-red-500 text-sm">
                  {errors.userType.message}
                </span>
              )}
            </div>
            <input
              {...register("doctorType", { required: "Practice is required" })}
              placeholder="Practice"
              className={inputClass}
            />
            {errors.doctorType && (
              <span className="text-red-500 text-sm col-span-2">
                {errors.doctorType.message}
              </span>
            )}
            <input
              {...register("specialization", { required: "Specialization is required" })}
              placeholder="Specialization"
              className={inputClass}
            />
            {errors.specialization && (
              <span className="text-red-500 text-sm col-span-2">
                {errors.specialization.message}
              </span>
            )}
            <div>
              <select
                {...register("clinicID", { required: "Clinic selection is required" })}
                className={inputClass}
              >
                <option value="">Select Clinic</option>
                {clinics.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name || c.nameaddress}
                  </option>
                ))}
              </select>
              {errors.clinicID && (
                <span className="text-red-500 text-sm">
                  {errors.clinicID.message}
                </span>
              )}
            </div>
            <input
              {...register("availability", { required: "Availability is required" })}
              placeholder="Availability"
              className={inputClass}
            />
            {errors.availability && (
              <span className="text-red-500 text-sm col-span-2">
                {errors.availability.message}
              </span>
            )}
            <textarea
              {...register("remarks")}
              placeholder="Remarks"
              className={`${inputClass} col-span-2`}
            />
          </div>

          {/* Save and Clear Buttons */}
          <div className="flex gap-3">
            <button type="submit" className={saveBtn}>
              {isEditing ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset(); // Clear form fields
                setEditId(null); // Exit editing mode
              }}
              className={clearBtn}
            >
              Clear
            </button>
          </div>
        </form>

        {/* User List and Search */}
        <div className="w-full bg-white p-6 rounded-lg shadow flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FiSearch className="text-gray-base" />
            <input
              className={inputClass}
              placeholder="Search users by last name"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <ul className="space-y-4 overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <li className="text-center text-gray-base">No users found.</li>
            ) : (
              filtered.map(u => (
                <li
                  key={u._id}
                  className="p-4 border rounded-lg flex justify-between hover:bg-accent-100/10 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <FaUserCircle size={30} className="text-gray-base" />
                    <div>
                      <p className="font-bold text-gray-dark">
                        {u.lastName}, {u.firstName} {u.middleName}
                      </p>
                      <p className="text-sm text-gray-base">
                        {u.mobileNo} | {u.email} | {u.userType}
                      </p>
                      {u.doctorType && <p>Practice: {u.doctorType}</p>}
                      {u.specialization && (
                        <p className="text-sm text-gray-base">
                          Specialization: {u.specialization}
                        </p>
                      )}
                      {u.availability && (
                        <p className="text-sm text-gray-base">
                          Availability: {u.availability}
                        </p>
                      )}
                      {u.clinicID && (
                        <p className="text-sm text-gray-base">
                          Clinic: {u.clinicID.name || u.clinicID.nameaddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(u)}
                    className={editBtn}
                    aria-label="Edit user"
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
