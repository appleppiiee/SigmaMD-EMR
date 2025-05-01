
// src/pages/Users.jsx
import "../css/Users.css";  
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { FiSearch } from 'react-icons/fi'
import { FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa'

export default function Users() {
  const token = localStorage.getItem('token')

  // react-hook-form for add/edit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    axios
      .get('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error('Error fetching users:', err)
        setUsers([])
      })
  }, [])

  const onSubmit = async (data) => {
    try {
      // auto‐generate email & password as before
      const payload = {
        ...data,
        email: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@example.com`,
        password: 'password123',
      }

      let res
      if (editId) {
        res = await axios.put(`/api/users/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers((u) => u.map((x) => (x._id === editId ? res.data : x)))
        setEditId(null)
      } else {
        res = await axios.post('/api/users', payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers((u) => [...u, res.data])
      }

      reset()
    } catch (err) {
      console.error('Submit failed:', err)
      alert('Failed to save user. Please check required fields.')
    }
  }

  const handleEdit = (user) => {
    setEditId(user._id)
    // populate form
    Object.entries(user).forEach(([k, v]) => {
      if (v !== undefined && register(k)) setValue(k, v)
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers((u) => u.filter((x) => x._id !== id))
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('Delete failed.')
    }
  }

  const filtered = users.filter((u) =>
    `${u.lastName} ${u.firstName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ display: 'flex' }}>
      <div className="main-content w-full users">

        {/* Full-height container */}
        <div
          className="flex flex-col lg:flex-row gap-6 p-6"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          {/* Add/Edit Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full lg:w-1/2 bg-white p-6 rounded shadow flex flex-col overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              {editId ? 'EDIT USER' : 'ADD USER'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register('firstName', { required: true })}
                placeholder="First Name"
                className="border p-2"
              />
              <input
                {...register('middleName')}
                placeholder="Middle Name"
                className="border p-2"
              />
              <input
                {...register('lastName', { required: true })}
                placeholder="Last Name"
                className="border p-2"
              />
              <input
                {...register('mobile', { required: true })}
                placeholder="Mobile No"
                className="border p-2"
              />
              <input
                {...register('phone')}
                placeholder="Phone No"
                className="border p-2"
              />
              <input
                {...register('dob')}
                type="date"
                className="border p-2"
              />
              <select
                {...register('role', { required: true })}
                className="border p-2"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="provider">Provider</option>
                <option value="secretary">Secretary</option>
              </select>
              <input
                {...register('specialization')}
                placeholder="Specialization"
                className="border p-2"
              />
              <input
                {...register('availability')}
                placeholder="Availability"
                className="border p-2"
              />
              <input
                {...register('remarks')}
                placeholder="Remarks"
                className="border p-2 col-span-2"
              />
            </div>

            <button
              type="submit"
              className="bg-[rgb(181_205_57)] text-white w-full py-3 rounded mt-4 hover:bg-[rgb(145_173_35)]"
            >
              {editId ? 'Update User' : 'Add User'}
            </button>
          </form>

          {/* List */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded shadow flex flex-col overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">USER LIST</h2>

            <div className="mb-4 flex items-center gap-2">
              <FiSearch className="text-gray-500" />
              <input
                className="border p-2 w-full"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
              {filtered.length === 0 && <p>No users found.</p>}

              {filtered.map((user) => (
                <div
                  key={user._id}
                  className="flex items-start bg-gray-50 p-4 rounded justify-between"
                >
                  <div className="flex items-start gap-4">
                    <FaUserCircle size={30} className="text-gray-400 mt-1" />
                    <div>
                      <p className="font-bold">
                        {user.lastName}, {user.firstName}{' '}
                        {user.middleName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.mobile || user.phone} | {user.role}
                      </p>
                      {user.specialization && (
                        <p className="text-sm">
                          Spec: {user.specialization}
                        </p>
                      )}
                      {user.availability && (
                        <p className="text-sm">
                          Avail: {user.availability}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-[rgb(181_205_57)] text-lg hover:text-[rgb(145_173_35)]"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 text-lg hover:text-red-800"
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
  )
}
