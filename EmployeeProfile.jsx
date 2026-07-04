import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar.jsx'

export default function EmployeeProfile() {
  const { id }               = useParams()
  const navigate             = useNavigate()
  const [emp,     setEmp]    = useState(null)
  const [leaves,  setLeaves] = useState([])
  const [loading, setLoad]   = useState(true)

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') { navigate('/'); return }
    axios.get(`http://localhost:5000/api/employee-profile/${id}`)
      .then(res => {
        setEmp(res.data.employee)
        setLeaves(res.data.leaves)
        setLoad(false)
      })
      .catch(() => setLoad(false))
  }, [id])

  const count = (s) => leaves.filter(l => l.status === s).length

  if (loading) return <div style={pg}><Navbar /><div style={center}>Loading...</div></div>
  if (!emp)    return <div style={pg}><Navbar /><div style={center}>Employee not found.</div></div>

  return (
    <div style={pg}>
      <Navbar />
      <div style={content}>

        {/* BACK BUTTON */}
        <button style={backBtn} onClick={() => navigate('/admin')}>
          ← Back to Admin Dashboard
        </button>

        {/* EMPLOYEE PROFILE CARD */}
        <div style={profileCard}>
          <div style={avatar}>{emp.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={{ margin:'0 0 6px', color:'#1e3a5f', fontSize:'22px', fontWeight:800 }}>{emp.name}</h2>
            <p style={infoTxt}>📧 {emp.email}</p>
            <p style={infoTxt}>🏢 {emp.department}</p>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={grid4}>
          {[
            { label:'Total Applied', val:leaves.length,    color:'#2d6a9f' },
            { label:'Approved',      val:count('approved'), color:'#27ae60' },
            { label:'Pending',       val:count('pending'),  color:'#f39c12' },
            { label:'Declined',      val:count('declined'), color:'#e74c3c' },
          ].map((c, i) => (
            <div key={i} style={statCard}>
              <div style={{ fontSize:'34px', fontWeight:800, color:c.color }}>{c.val}</div>
              <div style={{ fontSize:'13px', color:'#888', marginTop:'4px' }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* LEAVE HISTORY TABLE */}
        <div style={tableCard}>
          <div style={tableHead}>Leave History for {emp.name}</div>
          {leaves.length === 0
            ? <div style={empty}>No leave requests found for this employee.</div>
            : <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Leave Type','From','To','Days','Reason','Status','Admin Note','Applied On'].map(h => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(l => (
                    <tr key={l.id}>
                      <td style={td}>{l.leave_type}</td>
                      <td style={td}>{l.from_date}</td>
                      <td style={td}>{l.to_date}</td>
                      <td style={td}><strong>{l.days}</strong></td>
                      <td style={td}>{l.reason}</td>
                      <td style={td}><Badge s={l.status} /></td>
                      <td style={{ ...td, color:'#888', fontSize:'13px' }}>{l.admin_note || '—'}</td>
                      <td style={{ ...td, color:'#aaa', fontSize:'12px' }}>{l.applied_on?.slice(0,10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>

      </div>
    </div>
  )
}

/* ── Badge component ── */
function Badge({ s }) {
  const map = {
    approved: ['#d4edda', '#155724'],
    declined: ['#f8d7da', '#721c24'],
    pending:  ['#fff3cd', '#856404'],
  }
  const [bg, color] = map[s] || map.pending
  return (
    <span style={{ background:bg, color, padding:'3px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  )
}

/* ── Styles ── */
const pg         = { minHeight:'100vh', background:'#f0f4f8', fontFamily:"'Nunito',Arial,sans-serif" }
const content    = { padding:'28px', maxWidth:'1000px', margin:'0 auto' }
const center     = { padding:'60px', textAlign:'center', color:'#aaa', fontSize:'16px' }
const backBtn    = { padding:'10px 20px', background:'#1e3a5f', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:700, fontSize:'14px', marginBottom:'24px', fontFamily:"'Nunito',Arial,sans-serif" }
const profileCard= { background:'#fff', borderRadius:'14px', padding:'24px 28px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'20px', marginBottom:'24px' }
const avatar     = { width:'64px', height:'64px', borderRadius:'50%', background:'#2d6a9f', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:800, flexShrink:0 }
const infoTxt    = { margin:'4px 0', color:'#555', fontSize:'14px' }
const grid4      = { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }
const statCard   = { background:'#fff', borderRadius:'12px', padding:'20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }
const tableCard  = { background:'#fff', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }
const tableHead  = { padding:'16px 20px', borderBottom:'1px solid #eee', fontWeight:800, color:'#1e3a5f', fontSize:'16px' }
const empty      = { padding:'40px', textAlign:'center', color:'#aaa', fontSize:'15px' }
const th         = { background:'#f7f8fc', padding:'11px 14px', textAlign:'left', fontSize:'12px', fontWeight:700, color:'#666', textTransform:'uppercase' }
const td         = { padding:'12px 14px', fontSize:'14px', borderBottom:'1px solid #f0f0f0' }
