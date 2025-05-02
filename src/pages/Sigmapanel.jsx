// src/pages/SigmaPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import '../css/Sigmapanel.css';

export default function SigmaPanel() {
  const navigate = useNavigate();
  const { state } = useLocation();
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
  } = state || {};

  // ── LOCAL STATE ──
  const [viewDate, setViewDate] = useState(new Date().toISOString().slice(0,10));
  const [vitals,    setVitals]    = useState({ vWeight:'', vHeight:'', vBmi:'', vTemp:'', vBloodPressure:'', vPulseRate:'' });
  const [history,   setHistory]   = useState({ mhMedicalHistory:'', mhFamilyHistory:'', mhSocialHistory:'', mhAllergies:'', mhCurrentMedications:'' });
  const [diagnosis, setDiagnosis] = useState({ diagnosis:'', plMedication:'', plReferrals:'', plFollowup:'', plProcedures:'', notes:'' });
  const [panelId,   setPanelId]   = useState(null);
  const [started,   setStarted]   = useState(false);

  // 1) LOAD existing panel (if any) by appointmentId
  useEffect(() => {
    if (!appointmentId) return;
    (async () => {
      try {
        // our backend GET /api/sigmapanels?appointmentID=...
        const { data } = await axios.get(`/api/sigmapanels?appointmentID=${appointmentId}`);
        if (data) {
          setPanelId(data._id);
          setVitals({
            vWeight:          data.vWeight || '',
            vHeight:          data.vHeight || '',
            vBmi:             data.vBmi || '',
            vTemp:            data.vTemp || '',
            vBloodPressure:   data.vBloodPressure || '',
            vPulseRate:       data.vPulseRate || ''
          });
          setHistory({
            mhMedicalHistory:     data.mhMedicalHistory || '',
            mhFamilyHistory:      data.mhFamilyHistory || '',
            mhSocialHistory:      data.mhSocialHistory || '',
            mhAllergies:          data.mhAllergies || '',
            mhCurrentMedications: data.mhCurrentMedications || ''
          });
          setDiagnosis({
            diagnosis:    data.diagnosis || '',
            plMedication: data.plMedication || '',
            plReferrals:  data.plReferrals || '',
            plFollowup:   data.plFollowup || '',
            plProcedures: data.plProcedures || '',
            notes:        data.notes || ''
          });
          if (data.createdAt) setStarted(true); 
        }
      } catch (err) {
        console.error('load panel error:', err);
      }
    })();
  }, [appointmentId]);

  // 2) MARK appointment.started on *first* field change
  const markStarted = async () => {
   
    if (!started && appointmentId) {
      await axios.put(`/api/appointments/${appointmentId}`, {
        started: new Date().toISOString()
      });     
    }
  };

  // generic change handler that also marks started
  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(old => ({ ...old, [name]: value }));
    markStarted();
  };

  // 3) SAVE panel + END appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !doctorId || !appointmentId) {
      return alert('Missing patient, doctor or appointment ID');
    }
    try {
      const payload = {
        patientID:     patientId,
        appointmentID: appointmentId,
        doctorID:      doctorId,
        visitDateTime: new Date().toISOString(),
        ...vitals,
        ...history,
        ...diagnosis
      };

      let savedPanel;
      if (panelId) {
        // UPDATE existing
        await axios.put(`/api/sigmapanels/${panelId}`, payload);
      } else {
        // CREATE new
        const { data: newPanel } = await axios.post('/api/sigmapanels', payload);
        setPanelId(newPanel._id);
      }

      // NOW end the appointment
      await axios.put(`/api/appointments/${appointmentId}`, {
        ended: new Date().toISOString()
      });

      // NAVIGATE to checkout
      navigate('/checkout', {
        state: {
          patientId, appointmentId, doctorId, clinicId, clinicName, patientName, 
          appointmentDate, appointmentTime, panelId
        }
      });
    } catch (err) {
      console.error('save panel error:', err);
      alert('Save failed');
    }
  };

  return (
    <div className="sigmapanel-container">
      <div className="sigmapanel-header">
        <button onClick={()=>navigate('/appointments')} className="back-btn" title="Back">
          <ChevronLeft size={24}/>
        </button>
        <div className="patient-info">
          <h2>{patientName || 'Unknown'}</h2>
          <div className="sub">{patientAge} | {patientSex}</div>
          <div className="sub">{clinicName}</div>
        </div>
        <div className="visit-date">
          <label>Visit Date</label>
          <input
            type="date"
            value={viewDate}
            onChange={e=>setViewDate(e.target.value)}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="sigmapanel-form">
        <section className="panel-section">
          <h3>Vitals</h3>
          <div className="grid-2">
            {Object.entries(vitals).map(([k,v]) => (
              <input
                key={k}
                name={k}
                value={v}
                onChange={handleChange(setVitals)}
                placeholder={k}
              />
            ))}
          </div>
        </section>

        <section className="panel-section">
          <h3>Medical History</h3>
          <div className="grid-1">
            {Object.entries(history).map(([k,v]) => (
              <textarea
                key={k}
                name={k}
                value={v}
                onChange={handleChange(setHistory)}
                placeholder={k}
              />
            ))}
          </div>
        </section>

        <section className="panel-section">
          <h3>Diagnosis & Plan</h3>
          <div className="grid-1">
            {Object.entries(diagnosis).map(([k,v]) =>
              k === 'notes' ? (
                <textarea
                  key={k}
                  name={k}
                  value={v}
                  onChange={handleChange(setDiagnosis)}
                  placeholder={k}
                />
              ) : (
                <input
                  key={k}
                  name={k}
                  value={v}
                  onChange={handleChange(setDiagnosis)}
                  placeholder={k}
                />
              )
            )}
          </div>
          <button type="submit" className="end-visit-btn">
            End Clinic Visit
          </button>
        </section>
      </form>
    </div>
  );
}
