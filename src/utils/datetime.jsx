// src/utils/datetime.js
import React from 'react'

const TORONTO = 'America/Toronto'

/**
 * Returns YYYY-MM-DD string for “today” in Toronto.
 */
export function getTorontoDateString() {
  // en-CA gives YYYY‑MM‑DD
  return new Date().toLocaleDateString('en-CA', {
    timeZone: TORONTO
  })
}

/**
 * Calculates age based on dobString (ISO or YYYY-MM-DD),
 * using Toronto’s “today”
 */
export function calculateAge(dobString) {
  if (!dobString) return ''
  // create Dates interpreted in Toronto
  const dobInToronto = new Date(
    new Date(dobString).toLocaleString('en-US', { timeZone: TORONTO })
  )
  const todayInToronto = new Date(
    new Date().toLocaleString('en-US', { timeZone: TORONTO })
  )

  let y = todayInToronto.getFullYear() - dobInToronto.getFullYear()
  let m = todayInToronto.getMonth() - dobInToronto.getMonth()
  let d = todayInToronto.getDate() - dobInToronto.getDate()

  if (d < 0) {
    m--
    // days in previous month (Toronto!)
    const daysInPrev = new Date(
      todayInToronto.getFullYear(),
      todayInToronto.getMonth(),
      0
    ).getDate()
    d += daysInPrev
  }
  if (m < 0) {
    y--
    m += 12
  }

  return `${y}Y-${m}M-${d}D`
}

/**
 * Given a "HH:mm" string, returns that time formatted in Toronto.
 */
export function formatTime(hhmm) {
  if (!hhmm) return '--:--'
  const datePart = getTorontoDateString()           // "YYYY-MM-DD"
  const iso = `${datePart}T${hhmm}:00`               // "YYYY-MM-DDTHH:mm:00"
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TORONTO
  })
}

/**
 * Given an ISO timestamp, formats just the time portion in Toronto.
 */
export function formatISOTime(isoString) {
  return isoString
    ? new Date(isoString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: TORONTO,
        hour12: false
      })
    : '--:--'
}

/**
 * Given any date‐string, returns a long, localized date in Toronto.
 */
export function formatDate(dateString) {
  return dateString
    ? new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: TORONTO
      })
    : '--'
}

/** 
 * Simple React helper to show a label + value
 */
export function TimeBox({ label, value }) {
  return (
    <div className="flex flex-col items-center border rounded p-2 min-w-[80px]">
      <div className="text-xs font-semibold">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  )
}


export const calcDuration = (startISO, endISO) => {
  if (!startISO || !endISO) return '--:--';
  const ms   = new Date(endISO) - new Date(startISO);
  const mins = Math.floor(ms / 60000);
  const h    = Math.floor(mins / 60);
  const m    = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};