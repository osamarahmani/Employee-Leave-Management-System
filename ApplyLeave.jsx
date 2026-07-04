import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar.jsx'

export default function ApplyLeave() {
  const navigate             = useNavigate()
  const [type,    setType]   = useState('')
  const [from,    setFrom]   = useState('')
  const [to,      setTo]     = useState('')
  const [reason,  setReason] = useState('')
  const [success, setOk]     = useState('')
  const [error,   setErr]    = useState('')
  const [loading, setLd]     = useState(false)

  const days = () => {
    if (!from || !to) return 0
    const d = (new Date(to) - new Date(from)) / 86400000 + 1
    return d > 0 ? d : 0
  }

  const submit = async () => {
    const uid = localStorage.getItem('user_id')
    if (!uid)   { navigate('/'); return }
    if (!type)  { setErr('Please select a leave type.');           return }
    if (!from)  { setErr('Please select a start date.');           return }
    if (!to)    { setErr('Please select an end date.');            return }
    if (!reason.trim()) { setErr('Please enter a reason.');        return }
    if (days() < 1)     { setErr('End date cannot be before start date.'); return }

    setLd(true); setErr(''); setOk('')
    try {
      const res = await axios.post('http://localhost:5000/api/apply', {
        user_id: uid, leave_type: type,
        from_date: from, to_date: to, reason
      })
      if (res.data.success) {
        setOk('✅ Leave request submitted! It is now pending admin approval.')
        setType(''); setFrom(''); setTo(''); setReason('')
      }
    } catch {
      setErr('Could not connect to server. Make sure the Flask backend is running.')
    }
    setLd(false)
  }

  return (
    <div style={pg}>
      <Navbar />
      <div style={content}>
        <h2 style={title}>Apply for Leave</h2>

        <div style={card}>
          <div style={cardH}>Fill in Leave Details</div>
          <div style={cardB}>

            {success && <div style={okBox}>{success}</div>}
            {error   && <div style={errBox}>⚠️ {error}</div>}

            <label style={lbl}>Leave Type</label>
            <select style={inp} value={type} onChange={e => setType(e.target.value)}>
              <option value="">-- Select Leave Type --</option>
              {['Annual Leave','Sick Leave','Casual Leave','Maternity / Paternity Leave','Unpaid Leave'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <div style={row2}>
              <div>
                <label style={lbl}>Start Date</label>
                <input style={inp} type="date" value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>End Date</label>
                <input style={inp} type="date" value={to} onChange={e => setTo(e.target.value)} />
              </div>
            </div>

            {days() > 0 && (
              <div style={info}>📅 Duration: <strong>{days()} day(s)</strong></div>
            )}

            <label style={lbl}>Reason for Leave</label>
            <textarea style={{ ...inp, resize:'vertical' }} rows="4"
              placeholder="Briefly explain your reason for leave..."
              value={reason} onChange={e => setReason(e.target.value)} />

            <button style={submitBtn} onClick={submit}>
              {loading ? 'Submitting...' : 'Submit Leave Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const pg        = { minHeight:'100vh', background:'#f0f4f8', fontFamily:"'Nunito',Arial,sans-serif" }
const content   = { padding:'28px', maxWidth:'620px', margin:'0 auto' }
const title     = { fontSize:'22px', fontWeight:800, color:'#1e3a5f', marginBottom:'20px' }
const card      = { background:'#fff', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }
const cardH     = { padding:'16px 20px', borderBottom:'1px solid #eee', fontWeight:800, color:'#1e3a5f', fontSize:'16px' }
const cardB     = { padding:'24px' }
const lbl       = { display:'block', fontWeight:700, fontSize:'13px', color:'#555', marginBottom:'6px' }
const inp       = { width:'100%', padding:'11px 14px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', marginBottom:'16px', boxSizing:'border-box', fontFamily:"'Nunito',Arial,sans-serif", outline:'none' }
const row2      = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }
const info      = { background:'#eaf3fb', padding:'10px 14px', borderRadius:'8px', fontSize:'13px', color:'#1e3a5f', marginBottom:'16px' }
const submitBtn = { padding:'12px 28px', background:'#2d6a9f', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',Arial,sans-serif" }
const okBox     = { background:'#eafaf1', border:'1px solid #a9dfbf', color:'#1e8449', padding:'10px 14px', borderRadius:'8px', marginBottom:'16px', fontSize:'13px', fontWeight:700 }
const errBox    = { background:'#fdecea', border:'1px solid #f5b7b1', color:'#c0392b', padding:'10px 14px', borderRadius:'8px', marginBottom:'16px', fontSize:'13px' }
