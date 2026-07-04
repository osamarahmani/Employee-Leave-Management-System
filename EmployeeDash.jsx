import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar.jsx'

export default function EmployeeDash() {
  const navigate         = useNavigate()
  const [leaves, set]    = useState([])
  const [loading, setLd] = useState(true)
  const name             = localStorage.getItem('user_name') || 'Employee'
  const userId           = localStorage.getItem('user_id')

  useEffect(() => {
    if (!userId) { navigate('/'); return }
    if (localStorage.getItem('role') === 'admin') { navigate('/admin'); return }
    axios.get(`http://localhost:5000/api/my-leaves/${userId}`)
      .then(r => { set(r.data); setLd(false) })
      .catch(() => setLd(false))
  }, [])

  const count = (s) => leaves.filter(l => l.status === s).length

  return (
    <div style={pg}>
      <Navbar />
      <div style={content}>
        <h2 style={greet}>Welcome back, {name} 👋</h2>
        <p style={subTxt}>Here is your leave summary</p>

        {/* STAT CARDS */}
        <div style={grid4}>
          {[
            { label:'Total Applied', val:leaves.length,   color:'#2d6a9f' },
            { label:'Approved',      val:count('approved'), color:'#27ae60' },
            { label:'Pending',       val:count('pending'),  color:'#f39c12' },
            { label:'Declined',      val:count('declined'), color:'#e74c3c' },
          ].map((c,i) => (
            <div key={i} style={card}>
              <div style={{ fontSize:'34px', fontWeight:800, color:c.color }}>{c.val}</div>
              <div style={{ fontSize:'13px', color:'#888', marginTop:'4px' }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* QUICK LINKS */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'24px' }}>
          <button style={qBtn('#2d6a9f')} onClick={() => navigate('/apply')}>✏️ Apply for Leave</button>
          <button style={qBtn('#27ae60')} onClick={() => navigate('/status')}>📜 View All My Leaves</button>
        </div>

        {/* RECENT TABLE */}
        <div style={tableCard}>
          <div style={tableHead}>Recent Leave Requests</div>
          {loading
            ? <div style={empty}>Loading...</div>
            : leaves.length === 0
            ? <div style={empty}>No leave requests yet. <span style={{ color:'#2d6a9f', cursor:'pointer' }} onClick={() => navigate('/apply')}>Apply now →</span></div>
            : <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>{['Type','From','To','Days','Reason','Status'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {leaves.slice(0,5).map(l => (
                    <tr key={l.id}>
                      <td style={td}>{l.leave_type}</td>
                      <td style={td}>{l.from_date}</td>
                      <td style={td}>{l.to_date}</td>
                      <td style={td}><strong>{l.days}</strong></td>
                      <td style={td}>{l.reason}</td>
                      <td style={td}><Badge s={l.status} /></td>
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
const content   = { padding:'28px', maxWidth:'950px', margin:'0 auto' }
const greet     = { fontSize:'22px', fontWeight:800, color:'#1e3a5f', marginBottom:'4px' }
const subTxt    = { color:'#888', marginBottom:'24px', fontSize:'14px' }
const grid4     = { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }
const card      = { background:'#fff', borderRadius:'12px', padding:'20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }
const tableCard = { background:'#fff', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }
const tableHead = { padding:'16px 20px', borderBottom:'1px solid #eee', fontWeight:800, color:'#1e3a5f', fontSize:'16px' }
const empty     = { padding:'40px', textAlign:'center', color:'#aaa', fontSize:'15px' }
const th        = { background:'#f7f8fc', padding:'11px 14px', textAlign:'left', fontSize:'12px', fontWeight:700, color:'#666', textTransform:'uppercase', letterSpacing:'0.5px' }
const td        = { padding:'12px 14px', fontSize:'14px', borderBottom:'1px solid #f0f0f0' }
const qBtn      = (bg) => ({ padding:'10px 20px', background:bg, color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',Arial,sans-serif" })
