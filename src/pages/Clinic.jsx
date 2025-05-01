// src/pages/Clinic.jsx
import "../css/Clinics.css";  
import { FiSearch } from "react-icons/fi";
import { FaHospital, FaEdit, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  createClinic,
  getClinics,
  updateClinic,
  deleteClinic,
} from "./api";

export default function Clinic() {
  const token = localStorage.getItem("token");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [clinics, setClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);

  // load on mount
  useEffect(() => {
    getClinics()
      .then((data) => setClinics(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching clinics:", err);
        setClinics([]);
      });
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      nameaddress: data.nameaddress,
      mobileNo: data.mobileNo,
      phone: data.phoneNo,
      remarks: data.remarks,
      providerID: "P56789",
      adminID: "A23456",
    };

    try {
      let res;
      if (editId) {
        // update
        res = await updateClinic(editId, payload);
        setClinics((c) =>
          c.map((x) => (x._id === editId ? res : x))
        );
        setEditId(null);
      } else {
        // create
        res = await createClinic(payload);
        setClinics((c) => [...c, res]);
      }
      reset();
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to save clinic.");
    }
  };

  const handleEdit = (clinic) => {
    setEditId(clinic._id);
    setValue("nameaddress", clinic.nameaddress || clinic.name);
    setValue("mobileNo", clinic.mobileNo);
    setValue("phoneNo", clinic.phone);
    setValue("remarks", clinic.remarks);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this clinic?")) return;
    try {
      await deleteClinic(id);
      setClinics((c) => c.filter((x) => x._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete clinic.");
    }
  };

  const filtered = clinics.filter((c) =>
    (c.nameaddress || c.name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <div className="main-content w-full clinics">
        <div
          className="flex flex-col lg:flex-row gap-6 p-6"
          style={{ height: "calc(100vh - 64px)" }} // leave room for your topbar
        >
          {/* ─── LEFT PANEL: Add / Edit Clinic ─── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full lg:w-1/2 bg-white p-6 rounded shadow flex flex-col overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              {editId ? "EDIT CLINIC" : "ADD CLINIC"}
            </h2>

            <div className="space-y-4">
              <input
                {...register("nameaddress", {
                  required: "Clinic name is required",
                })}
                placeholder="Clinic Name"
                className="border p-2 w-full"
              />
              {errors.nameaddress && (
                <p className="text-red-500 text-sm">
                  {errors.nameaddress.message}
                </p>
              )}

              <input
                {...register("mobileNo", {
                  pattern: {
                    value: /^[0-9-]+$/,
                    message: "Only numbers and dashes allowed",
                  },
                })}
                placeholder="Mobile No"
                className="border p-2 w-full"
              />
              {errors.mobileNo && (
                <p className="text-red-500 text-sm">
                  {errors.mobileNo.message}
                </p>
              )}

              <input
                {...register("phoneNo")}
                placeholder="Phone No"
                className="border p-2 w-full"
              />

              <input
                {...register("remarks")}
                placeholder="Remarks"
                className="border p-2 w-full"
              />

              <button
                type="submit"
                className="bg-green-600 text-white py-3 rounded w-full hover:bg-green-700"
              >
                {editId ? "Update Clinic" : "Add Clinic"}
              </button>
            </div>
          </form>

          {/* ─── RIGHT PANEL: Clinic List ─── */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded shadow flex flex-col">
            <h2 className="text-xl font-bold mb-4">CLINIC LIST</h2>

            <div className="mb-4 flex items-center gap-2">
              <FiSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
              {filtered.length === 0 && <p>No clinics found.</p>}

              {filtered.map((c) => (
                <div
                  key={c._id}
                  className="flex items-start bg-gray-50 p-4 rounded justify-between"
                >
                  <div className="flex items-start gap-4">
                    <FaHospital
                      size={30}
                      className="text-gray-400 mt-1"
                    />
                    <div>
                      <p className="font-bold">
                        {c.nameaddress || c.name}
                      </p>
                      {c.mobileNo && (
                        <p className="text-sm text-gray-600">
                          Mobile: {c.mobileNo}
                        </p>
                      )}
                      {c.phone && (
                        <p className="text-sm text-gray-600">
                          Phone: {c.phone}
                        </p>
                      )}
                      {c.remarks && (
                        <p className="text-sm">{c.remarks}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
