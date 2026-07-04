import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar.jsx'

export default function LeaveStatus() {
  const navigate         = useNavigate()
  const [leaves, set]    = useState([])
  const [loading, setLd] = useState(true)

  useEffect(() => {
    const uid = localStorage.getItem('user_id')
    if (!uid) { navigate('/'); return }
    axios.get(`http://localhost:5000/api/my-leaves/${uid}`)
      .then(r => { set(r.data); setLd(false) })
      .catch(() => setLd(false))
  }, [])

  return (
    <div style={pg}>
      <Navbar />
      <div style={content}>
        <h2 style={title}>My Leave History</h2>
        <p style={sub}>{leaves.length} request(s) found</p>

        <div style={tableCard}>
          <div style={tableHead}>All My Leave Requests</div>
          {loading
            ? <div style={empty}>Loading...</div>
            : leaves.length === 0
            ? <div style={empty}>No leave requests found.</div>
            : <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>{['Type','From','To','Days','Reason','Status','Admin Note'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
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

function Badge({ s }) {
  const map = { approved:['#d4edda','#155724'], declined:['#f8d7da','#721c24'], pending:['#fff3cd','#856404'] }
  const [bg, color] = map[s] || map.pending
  return <span style={{ background:bg, color, padding:'3px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
}

const pg        = { minHeight:'100vh', background:'#f0f4f8', fontFamily:"'Nunito',Arial,sans-serif" }
const content   = { padding:'28px', maxWidth:'1000px', margin:'0 auto' }
const title     = { fontSize:'22px', fontWeight:800, color:'#1e3a5f', marginBottom:'4px' }
const sub       = { color:'#888', fontSize:'14px', marginBottom:'20px' }
const tableCard = { background:'#fff', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }
const tableHead = { padding:'16px 20px', borderBottom:'1px solid #eee', fontWeight:800, color:'#1e3a5f', fontSize:'16px' }
const empty     = { padding:'40px', textAlign:'center', color:'#aaa', fontSize:'15px' }
const th        = { background:'#f7f8fc', padding:'11px 14px', textAlign:'left', fontSize:'12px', fontWeight:700, color:'#666', textTransform:'uppercase' }
const td        = { padding:'12px 14px', fontSize:'14px', borderBottom:'1px solid #f0f0f0' }
