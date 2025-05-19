// src/pages/SigmaPanel.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import axios from 'axios'
import '../css/Sigmapanel.css'

// ── CONFIG ARRAYS ────────────────────────────────
const vitalsConfig = [
  { key: 'vHeight',        label: 'Height' },
  { key: 'vWeight',        label: 'Weight' },
  { key: 'vTemp',          label: 'Temperature' },
  { key: 'vBloodPressure', label: 'Blood Pressure' },
  { key: 'vPulseRate',     label: 'Pulse Rate' },
]

const historyConfig = [
  { key: 'mhMedicalHistory',     label: 'Medical History' },
  { key: 'mhFamilyHistory',      label: 'Family History' },
  { key: 'mhSocialHistory',      label: 'Social History' },
  { key: 'mhAllergies',          label: 'Allergies' },
  { key: 'mhCurrentMedications', label: 'Current Medications' },
]

const diagnosisConfig = [
  { key: 'diagnosis',    label: 'Diagnosis' },
  { key: 'plMedication',  label: 'Prescribed Medication' },
  { key: 'plReferrals',   label: 'Referrals' },
  { key: 'plFollowup',    label: 'Follow-up' },
  { key: 'plProcedures',  label: 'Procedures' },
  { key: 'notes',         label: 'Notes' },
]

// ── REUSABLE HOOK ────────────────────────────────
function useFormFields(config) {
  const [fields, setFields] = useState(
    config.reduce((acc, { key }) => ({ ...acc, [key]: '' }), {})
  )

  const handleChange = e => {
    const { name, value } = e.target
    setFields(old => ({ ...old, [name]: value }))
  }

  return [fields, handleChange, setFields]
}

// ── PAGE COMPONENT ────────────────────────────────
export default function SigmaPanel() {
  const navigate = useNavigate()
  const { state = {} } = useLocation()
  const {
    appointmentId,
    patientId,
    doctorId,
    clinicId,
    patientName,
    patientAge,
    patientSex,
    clinicName,
    appointmentDate,
    appointmentTime
  } = state

  const [panels,          setPanels]          = useState([])
  const [selectedPanelId, setSelectedPanelId] = useState('')
  const [viewDate,        setViewDate]        = useState('')

  const [vitals,    , setVitals]    = useFormFields(vitalsConfig)
  const [history,   , setHistory]   = useFormFields(historyConfig)
  const [diagnosis, , setDiagnosis] = useFormFields(diagnosisConfig)
  const [started, setStarted] = useState(false)

  const formatDate = ds => {
    if (!ds) return '--'
    const [y,m,d] = ds.split('-').map(Number)
    return new Date(y,m-1,d).toLocaleDateString('en-US',{
      timeZone: 'America/Toronto',
      year:  'numeric',
      month: 'short',
      day:   'numeric'
    })
  }

  const markStarted = async () => {
    if (!started && appointmentId) {
      try {
        await axios.put(`/api/appointments/${appointmentId}`, {
          started: new Date().toISOString()
        })
        setStarted(true)
      } catch (err) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    if (!patientId) return
    ;(async () => {
      try {
        const { data } = await axios.get(
          `/api/sigmapanels?patientID=${patientId}`
        )
        const valid = (Array.isArray(data) ? data : [])
          .filter(p => p.appointmentID?.date)
          .sort((a,b) =>
            new Date(b.appointmentID.date) - new Date(a.appointmentID.date)
          )

        setPanels(valid)
        const current = valid.find(p => p.appointmentID._id === appointmentId)
        setSelectedPanelId(current ? current._id : valid[0]?._id || '')
      } catch (err) {
        console.error('fetch panels:', err)
      }
    })()
  }, [patientId, appointmentId])

  useEffect(() => {
    const panel = panels.find(p => p._id === selectedPanelId)
    if (!panel) {
      setViewDate('')
      return
    }

    setViewDate(formatDate(panel.appointmentID.date))

    setVitals(
      vitalsConfig.reduce((acc, { key }) => ({
        ...acc,
        [key]: panel[key] || ''
      }), {})
    )
    setHistory(
      historyConfig.reduce((acc, { key }) => ({
        ...acc,
        [key]: panel[key] || ''
      }), {})
    )
    setDiagnosis(
      diagnosisConfig.reduce((acc, { key }) => ({
        ...acc,
        [key]: panel[key] || ''
      }), {})
    )
    setStarted(!!panel.started)
  }, [selectedPanelId, panels])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!patientId || !doctorId || !appointmentId)
      return alert('Missing IDs')

    try {
      const payload = {
        patientID:     patientId,
        appointmentID: appointmentId,
        doctorID:      doctorId,
        visitDateTime: new Date().toISOString(),
        ...vitals,
        ...history,
        ...diagnosis
      }

      if (selectedPanelId) {
        await axios.put(`/api/sigmapanels/${selectedPanelId}`, payload)
      } else {
        const { data: newPanel } = await axios.post(
          '/api/sigmapanels', payload
        )
        setSelectedPanelId(newPanel._id)
      }

      await axios.put(`/api/appointments/${appointmentId}`, {
        ended: new Date().toISOString()
      })

      navigate('/checkout', {
        state: {
          patientId,
          appointmentId,
          doctorId,
          clinicId,
          clinicName,
          patientName,
          appointmentDate,
          appointmentTime,
          sigmapanelId: selectedPanelId
        }
      })
    } catch (err) {
      console.error(err)
      alert('Save failed')
    }
  }

  const inputClass = `
    block w-full text-gray-dark placeholder-gray-base
    bg-white border border-gray-base rounded-lg
    px-4 py-2
    hover:bg-accent-100/10
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-200
  `
  const buttonClass = `
    bg-accent-100 hover:bg-accent-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-300
    text-on-accent font-semibold p-3 rounded
  `

  return (
    <div className="sigmapanel-container h-full flex flex-col p-3">
      {/* HEADER */}
      <div className="bg-white p-3 rounded shadow flex items-center justify-between flex-shrink-0">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/appointments')}
            className={`${buttonClass} p-2 rounded-full`}
            aria-label="Back to appointments"
          >
            <ChevronLeft size={24}/>
          </button>
          <div className="ml-4">
            <h2 className="font-bold uppercase">{patientName || 'Unknown'}</h2>
            <div className="text-sm text-gray-base">
              {patientAge} | {patientSex}
            </div>
            <div className="text-sm text-gray-base">{clinicName}</div>
          </div>
        </div>
        <div>
          <select
            aria-label="Visit Date"
            className={inputClass}
            value={selectedPanelId}
            onChange={e => setSelectedPanelId(e.target.value)}
            disabled={!panels.length}
          >
            {!panels.length
              ? <option>No visits</option>
              : panels.map(p => (
                  <option key={p._id} value={p._id}>
                    {formatDate(p.appointmentID.date)}
                  </option>
                ))
            }
          </select>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden mt-0">
        <form
          onSubmit={handleSubmit}
          className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-3 items-stretch overflow-auto"
        >
          {/* Vitals: 20% on lg */}
          <section className="lg:col-span-1 bg-white p-3 rounded shadow space-y-2 h-full">
            <h3 className="font-semibold mb-2">Vitals</h3>
            {vitalsConfig.map(({ key, label }) => (
              <input
                key={key}
                name={key}
                placeholder={label}
                aria-label={label}
                value={vitals[key]}
                onChange={e => { markStarted(); setVitals(old => ({ ...old, [key]: e.target.value })) }}
                className={inputClass}
              />
            ))}
          </section>

          {/* Medical History: 40% on lg */}
          <section className="lg:col-span-2 bg-white p-3 rounded shadow space-y-2 h-full">
            <h3 className="font-semibold mb-2">History</h3>
            {historyConfig.map(({ key, label }) => (
              <textarea
                key={key}
                name={key}
                placeholder={label}
                aria-label={label}
                value={history[key]}
                onChange={e => { markStarted(); setHistory(old => ({ ...old, [key]: e.target.value })) }}
                className={`${inputClass} h-24`}
              />
            ))}
          </section>

          {/* Diagnosis & Plan: 40% on lg */}
          <section className="lg:col-span-2 bg-white p-3 rounded shadow flex flex-col justify-between h-full">
            <div className="space-y-2 overflow-auto">
              <h3 className="font-semibold mb-2">Diagnosis &amp; Plan</h3>
              {diagnosisConfig.map(({ key, label }) =>
                key === 'plMedication'|| key === 'notes' || key === 'plProcedures'? (
                  <textarea
                    key={key}
                    name={key}
                    placeholder={label}
                    aria-label={label}
                    value={diagnosis[key]}
                    onChange={e => { markStarted(); setDiagnosis(old => ({ ...old, [key]: e.target.value })) }}
                    className={`${inputClass} h-24`}
                  />
                ) : (
                  <input
                    key={key}
                    name={key}
                    placeholder={label}
                    aria-label={label}
                    value={diagnosis[key]}
                    onChange={e => { markStarted(); setDiagnosis(old => ({ ...old, [key]: e.target.value })) }}
                    className={inputClass}
                  />
                )
              )}
            </div>
            <button type="submit" className={`${buttonClass} mt-2`}>
              End Clinic Visit
            </button>
          </section>
        </form>
      </div>
    </div>
  )
}
