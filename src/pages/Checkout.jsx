// src/pages/Checkout.jsx
import { useState, useEffect }   from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios          from 'axios'

export default function Checkout() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const {
    // optional, only if editing:
    checkoutId,

    // required to link this checkout
    appointmentId,
    patientId,
    clinicId,
    panelId:    sigmapanelId,
    doctorId,

    // display
    appointmentDate,
    appointmentTime,
    patientName,
    clinicName,
    paymentMethod: pmFromState
  } = state || {}

  const paymentMethod = pmFromState || 'Cash'

  // ─── LINE‐ITEM FORM STATE
  const [items, setItems] = useState([])
  const [desc,  setDesc]  = useState('')
  const [price, setPrice] = useState('')
  const [qty,   setQty]   = useState(1)

  // ─── PAYMENT STATE
  const [cash,  setCash]  = useState('')

  // ─── LOADING FLAG
  const [loading, setLoading] = useState(false)

  // ─── ON MOUNT: if editing, fetch existing
  useEffect(() => {
    if (!checkoutId) return
    setLoading(true)
    axios.get(`/api/checkouts/${checkoutId}`)
      .then(({ data }) => {
        // populate items
        setItems(data.items || [])
        // populate payment.cash & change
        setCash(data.payment.cashReceived?.toString() || '0')
      })
      .catch(err => {
        console.error(err)
        alert('Failed to load existing checkout')
      })
      .finally(() => setLoading(false))
  }, [checkoutId])

  // ─── ADD LINE ITEM
  const addItem = () => {
    if (!desc.trim() || !price) return
    const p = parseFloat(price)
    setItems(i => [
      ...i,
      {
        description: desc,
        type:        'Service',
        price:       p,
        quantity:    qty,
        amount:      +(p * qty).toFixed(2)
      }
    ])
    setDesc('')
    setPrice('')
    setQty(1)
  }

  // ─── COMPUTE TOTALS
  const subtotal  = items.reduce((sum,i) => sum + i.amount, 0)
  const taxRate   = 0.13
  const taxAmount = +(subtotal * taxRate).toFixed(2)
  const total     = +(subtotal + taxAmount).toFixed(2)
  const cashNum   = parseFloat(cash) || 0
  const changeDue = cashNum > 0 ? +(cashNum - total).toFixed(2) : 0

  // ─── SUBMIT HANDLER (POST or PUT)
  const handleSubmit = async e => {
    e.preventDefault()
    if (!clinicId || !sigmapanelId) {
      return alert('Missing clinic or panel ID!')
    }

    const payload = {
      appointmentID: appointmentId,
      patientID:     patientId,
      clinicID: clinicId,
      sigmapanelID : sigmapanelId,
      doctorID : doctorId,
      checkInDate:   appointmentDate,
      checkInTime:   appointmentTime,
      items,
      payment: {
        method:       paymentMethod,
        cashReceived: cashNum,
        changeDue
      }
    }

    try {
      if (checkoutId) {
        // update existing
        await axios.put(`/api/checkouts/${checkoutId}`, payload)
      } else {
        // create new
        await axios.post(`/api/checkouts`, payload)
      }
      navigate('/appointments')
    } catch(err) {
      console.error(err)
      alert(err.response?.data?.message || 'Checkout failed!')
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <div className="flex h-full">
      {/* ─── LEFT PANEL (Billing Summary) ─── */}
      <div className="w-1/2 border-r p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Billing Summary</h2>
        <p><strong>Patient:</strong> {patientName}</p>
        <p><strong>Clinic:</strong>  {clinicName}</p>
        <p><strong>Checked-in:</strong> {appointmentTime} on {appointmentDate}</p>
        <p><strong>Payment:</strong> {paymentMethod}</p>

        <div className="mt-6 mb-4 flex space-x-2">
          <input
            className="flex-1 border p-2"
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <input
            type="number"
            className="w-20 border p-2"
            value={qty}
            onChange={e => setQty(Math.max(1, +e.target.value))}
          />
          <input
            type="number"
            className="w-32 border p-2"
            placeholder="Unit price"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <button
            onClick={addItem}
            className="bg-blue-600 text-white px-4 rounded"
          >Add</button>
        </div>

        <table className="w-full mb-4">
          <thead className="border-b font-medium">
            <tr>
              <th className="text-left">Particular</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it,i) => (
              <tr key={i} className="border-b">
                <td>{it.description}</td>
                <td className="text-center">{it.quantity}</td>
                <td className="text-right">${it.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── RIGHT PANEL (Payment Summary) ─── */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>HST (13%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Cash Received</label>
          <input
            type="number"
            className="w-full border p-2"
            value={cash}
            onChange={e => setCash(e.target.value)}
          />
        </div>

        {cashNum > 0 && (
          <div className="mb-4 text-green-700">
            Change: ${changeDue.toFixed(2)}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700"
        >
          {checkoutId ? 'Update Checkout' : 'Complete Checkout'}
        </button>
      </div>
    </div>
  )
}
