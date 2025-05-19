// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Checkout() {
  const navigate = useNavigate()
  const { state = {} } = useLocation()
  const {
    appointmentId,
    patientId,
    clinicId,
    sigmapanelId,
    doctorId,
    appointmentDate,
    appointmentTime,
    patientName,
    clinicName,
    paymentMethod: pmFromState,
    checkoutId: passedId
  } = state

  const paymentMethod = pmFromState || 'Cash'
  const [checkoutId, setCheckoutId] = useState(passedId || null)
  const [loading,    setLoading]    = useState(false)

  // ── LINE ITEMS ──────────────────────────────
  const [items, setItems]   = useState([])
  const [desc,  setDesc]    = useState('')
  const [price, setPrice]   = useState('')
  const [qty,   setQty]     = useState(1)
  const [editIdx, setEditIdx] = useState(-1)

  // ── PAYMENT ─────────────────────────────────
  const [cash, setCash] = useState('')

  function loadById(id) {
    setLoading(true)
    axios.get(`/api/checkouts/${id}`)
      .then(({ data }) => {
        setItems(data.items)
        setCash(data.payment.cashReceived.toString())
        setCheckoutId(data._id)
      })
      .catch(err => console.error('Load by id failed', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (passedId) {
      loadById(passedId)
    } else if (appointmentId && sigmapanelId) {
      setLoading(true)
      axios.get('/api/checkouts/find', {
        params: { appointmentID: appointmentId, sigmapanelID: sigmapanelId }
      })
      .then(({ data }) => loadById(data._id))
      .catch(err => {
        if (err.response?.status !== 404) {
          console.error('Lookup failed', err)
          alert('Failed to lookup existing billing')
        }
      })
      .finally(() => setLoading(false))
    }
  }, [passedId, appointmentId, sigmapanelId])

  const addItem = () => {
    if (!desc.trim() || !price) return
    const p = parseFloat(price)
    const newItem = {
      description: desc,
      type:        'Service',
      price:       p,
      quantity:    qty,
      amount:      +(p * qty).toFixed(2)
    }
    setItems(curr =>
      editIdx >= 0
        ? curr.map((it,i) => i === editIdx ? newItem : it)
        : [...curr, newItem]
    )
    setDesc(''); setPrice(''); setQty(1); setEditIdx(-1)
  }

  const editItem = i => {
    const it = items[i]
    setDesc(it.description)
    setPrice(it.price.toString())
    setQty(it.quantity)
    setEditIdx(i)
  }

  const subtotal  = items.reduce((sum,i)=> sum + i.amount, 0)
  const taxRate   = 0.13
  const taxAmount = +(subtotal * taxRate).toFixed(2)
  const total     = +(subtotal + taxAmount).toFixed(2)
  const cashNum   = parseFloat(cash) || 0
  const changeDue = +(cashNum - total).toFixed(2)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!appointmentId||!patientId||!clinicId||!sigmapanelId||!doctorId)
      return alert('Missing IDs')

    setLoading(true)
    const payload = {
      appointmentID: appointmentId,
      patientID:     patientId,
      clinicID:      clinicId,
      sigmapanelID:  sigmapanelId,
      doctorID:      doctorId,
      checkInDate:   new Date(appointmentDate).toISOString(),
      checkInTime:   appointmentTime,
      items, subtotal, taxRate, taxAmount, total,
      payment: { method: paymentMethod, cashReceived: cashNum, changeDue },
      checkoutStatus: 'Completed'
    }

    try {
      if (checkoutId) {
        await axios.put(`/api/checkouts/${checkoutId}`, payload)
      } else {
        const { data: created } = await axios.post('/api/checkouts', payload)
        setCheckoutId(created._id)
      }
      await axios.put(`/api/appointments/${appointmentId}`, {
        status: 'completed',
        ended:  new Date().toISOString()
      })
      navigate('/appointments', {
        state: { message: 'Appointment completed & billing saved.' }
      })
    } catch (err) {
      console.error('Save failed', err)
      alert(err.response?.data?.message || 'Save failed')
    } finally { setLoading(false) }
  }

  if (loading) return <div className="p-8">Loading…</div>

  // ── WCAG-FRIENDLY CLASSES ────────────────────
  const inputClass = `
    block w-full text-gray-dark placeholder-gray-base
    bg-white border border-gray-base rounded-lg
    px-4 py-2
    hover:bg-accent-100/10
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-200
  `.trim().replace(/\s+/g,' ')
  const narrowBase = `bg-white border hover:bg-accent-100/10 border-gray-base rounded-lg px-4 py-2`
  const narrowFocus = `hover:bg-accent-100/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-200`
  const qtyClass   = `w-20 text-gray-dark placeholder-gray-base text-center ${narrowBase} ${narrowFocus}`
  const priceClass = `w-32 text-gray-dark placeholder-gray-base${narrowBase} ${narrowFocus}`

  const buttonClass = `
    bg-accent-100 hover:bg-accent-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-300
    text-on-accent font-semibold px-4 py-2 rounded-lg
  `.trim().replace(/\s+/g,' ')

  return (
    <div className="flex h-full p-3">
       <div className="w-full flex flex-col lg:flex-row gap-3">
        <div className="w-full lg:w-3/5 bg-white p-4 rounded shadow flex flex-col overflow-auto">
          <h2 className="text-xl font-semibold mb-4">
            {checkoutId ? 'Edit Billing' : 'New Billing'}
          </h2>
          <p><strong>Patient:</strong> {patientName}</p>
          <p><strong>Clinic:</strong> {clinicName}</p>
          <p><strong>Checked-in:</strong> {appointmentTime} on {appointmentDate}</p>
          <p><strong>Payment:</strong> {paymentMethod}</p>

          <div className="mt-6 mb-4 flex space-x-2">
            <input
              className={inputClass}
              placeholder="Description"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <input
              type="number"
              className={qtyClass}
              min={1}
              value={qty}
              onChange={e => setQty(Math.max(1, +e.target.value))}
            />
            <input
              type="number"
              className={priceClass}
              placeholder="Unit price"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            <button onClick={addItem} className={buttonClass}>
              {editIdx >= 0 ? 'Save' : 'Add'}
            </button>
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
                <tr
                  key={i}
                  className="border-b cursor-pointer hover:bg-accent-100/10"
                  onClick={()=>editItem(i)}
                >
                  <td>{it.description}</td>
                  <td className="text-center">{it.quantity}</td>
                  <td className="text-right">${it.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit}
              className="w-full lg:w-2/5 bg-white p-4 rounded shadow flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Billing Summary</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>HST (13%):</span><span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-dark">
              Cash Received
            </label>
            <input
              type="number"
              className={inputClass}
              value={cash}
              onChange={e => setCash(e.target.value)}
            />
          </div>

          {cashNum > 0 && (
            <div className="mb-4 text-green-700">
              Change: ${changeDue.toFixed(2)}
            </div>
          )}

          <button type="submit" className={buttonClass}>
            {checkoutId ? 'Save Changes' : 'Complete Checkout'}
          </button>
        </form>
      </div>
    </div>
  )
}
