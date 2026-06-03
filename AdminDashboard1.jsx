import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar.jsx'

export default function AdminDash() {
  const navigate           = useNavigate()
  const [leaves,  setL]    = useState([])
  const [loading, setLd]   = useState(true)
  const [tab,     setTab]  = useState('all')      // 'all' | 'pending'
  const [modal,   setModal]= useState(null)        // leave object being reviewed
  const [note,    setNote] = useState('')

  const load = () => {
    axios.get('http://localhost:5000/api/all-leaves')
      .then(r => { setL(r.data); setLd(false) })
      .catch(() => setLd(false))
  }

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (!role)           { navigate('/');      return }
    if (role !== 'admin'){ navigate('/dashboard'); return }
    load()
  }, [])

  const takeAction = async (action) => {
    try {
      await axios.post(`http://localhost:5000/api/action/${modal.id}`, { status: action, note })
      setModal(null); setNote('')
      load()
    } catch {
      alert('Error. Make sure Flask backend is running.')
    }
  }

  const count   = (s) => leaves.filter(l => l.status === s).length
  const shown   = tab === 'pending' ? leaves.filter(l => l.status === 'pending') : leaves

  return (
    <div style={pg}>
      <Navbar />
      <div style={content}>
        <h2 style={title}>Admin Dashboard</h2>
        <p style={sub}>Manage all employee leave requests</p>

        {/* STAT CARDS */}
        <div style={grid4}>
          {[
            { label:'Total',    val:leaves.length,    color:'#2d6a9f' },
            { label:'Pending',  val:count('pending'),  color:'#f39c12' },
            { label:'Approved', val:count('approved'), color:'#27ae60' },
            { label:'Declined', val:count('declined'), color:'#e74c3c' },
          ].map((c,i) => (
            <div key={i} style={card}>
              <div style={{ fontSize:'34px', fontWeight:800, color:c.color }}>{c.val}</div>
              <div style={{ fontSize:'13px', color:'#888', marginTop:'4px' }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* TAB BUTTONS */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
          {[['all','All Requests'],['pending','⏳ Pending Only']].map(([k,lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ padding:'8px 20px', borderRadius:'20px', border:'none', cursor:'pointer', fontWeight:700, fontSize:'13px', fontFamily:"'Nunito',Arial,sans-serif",
                background: tab===k ? '#2d6a9f' : '#fff', color: tab===k ? '#fff' : '#555',
                boxShadow:'0 2px 6px rgba(0,0,0,0.08)' }}>
              {lbl}
              {k==='pending' && count('pending') > 0 &&
                <span style={{ background:'#e74c3c', color:'#fff', borderRadius:'20px', padding:'1px 7px', fontSize:'11px', marginLeft:'6px' }}>{count('pending')}</span>}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div style={tableCard}>
          <div style={tableHead}>{tab === 'pending' ? 'Pending Leave Requests' : 'All Leave Requests'}</div>
          {loading
            ? <div style={empty}>Loading...</div>
            : shown.length === 0
            ? <div style={empty}>{tab === 'pending' ? '🎉 No pending requests!' : 'No records found.'}</div>
            : <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>{['Employee','Department','Type','From','To','Days','Reason','Status','Action'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {shown.map(l => (
                    <tr key={l.id}>
                      <td style={td}><strong>{l.emp_name}</strong></td>
                      <td style={td}>{l.department}</td>
                      <td style={td}>{l.leave_type}</td>
                      <td style={td}>{l.from_date}</td>
                      <td style={td}>{l.to_date}</td>
                      <td style={td}><strong>{l.days}</strong></td>
                      <td style={td}>{l.reason}</td>
                      <td style={td}><Badge s={l.status} /></td>
                      <td style={td}>
                        {l.status === 'pending'
                          ? <button style={revBtn} onClick={() => { setModal(l); setNote('') }}>Review</button>
                          : <span style={{ color:'#aaa', fontSize:'13px' }}>{l.admin_note || '—'}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={overlay}>
          <div style={modalBox}>
            <h3 style={{ color:'#1e3a5f', marginBottom:'16px', fontSize:'18px' }}>Review Leave Request</h3>
            <p style={{ color:'#888', fontSize:'13px', marginBottom:'16px' }}>by {modal.emp_name} · {modal.department}</p>

            <div style={detailBox}>
              {[['Leave Type', modal.leave_type],['From', modal.from_date],['To', modal.to_date],['Duration', modal.days+' day(s)'],['Reason', modal.reason]].map(([k,v]) => (
                <div key={k} style={detRow}>
                  <span style={{ color:'#888', fontWeight:700 }}>{k}</span>
                  <span style={{ color:'#222', fontWeight:600, textAlign:'right', maxWidth:'60%' }}>{v}</span>
                </div>
              ))}
            </div>

            <label style={lbl}>Admin Note (optional)</label>
            <textarea style={{ ...noteTa }} rows="2" placeholder="Add a note for the employee..."
              value={note} onChange={e => setNote(e.target.value)} />

            <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
              <button style={aBtn('#27ae60')} onClick={() => takeAction('approved')}>✅ Approve</button>
              <button style={aBtn('#e74c3c')} onClick={() => takeAction('declined')}>❌ Decline</button>
              <button style={aBtn('#ecf0f1','#555')} onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Badge({ s }) {
  const map = { approved:['#d4edda','#155724'], declined:['#f8d7da','#721c24'], pending:['#fff3cd','#856404'] }
  const [bg, color] = map[s] || map.pending
  return <span style={{ background:bg, color, padding:'3px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
}

const pg        = { minHeight:'100vh', background:'#f0f4f8', fontFamily:"'Nunito',Arial,sans-serif" }
const content   = { padding:'28px', maxWidth:'1100px', margin:'0 auto' }
const title     = { fontSize:'22px', fontWeight:800, color:'#1e3a5f', marginBottom:'4px' }
const sub       = { color:'#888', fontSize:'14px', marginBottom:'24px' }
const grid4     = { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px' }
const card      = { background:'#fff', borderRadius:'12px', padding:'20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }
const tableCard = { background:'#fff', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }
const tableHead = { padding:'16px 20px', borderBottom:'1px solid #eee', fontWeight:800, color:'#1e3a5f', fontSize:'16px' }
const empty     = { padding:'40px', textAlign:'center', color:'#aaa', fontSize:'15px' }
const th        = { background:'#f7f8fc', padding:'11px 14px', textAlign:'left', fontSize:'12px', fontWeight:700, color:'#666', textTransform:'uppercase' }
const td        = { padding:'12px 14px', fontSize:'14px', borderBottom:'1px solid #f0f0f0' }
const revBtn    = { padding:'6px 16px', background:'#eaf3fb', border:'1px solid #c0d9ef', borderRadius:'8px', color:'#2d6a9f', fontWeight:700, cursor:'pointer', fontSize:'12px', fontFamily:"'Nunito',Arial,sans-serif" }
const overlay   = { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }
const modalBox  = { background:'#fff', borderRadius:'14px', padding:'28px', width:'100%', maxWidth:'460px', boxShadow:'0 16px 48px rgba(0,0,0,0.25)' }
const detailBox = { background:'#f7f8fc', borderRadius:'10px', padding:'14px', marginBottom:'16px' }
const detRow    = { display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #eee', fontSize:'14px' }
const lbl       = { display:'block', fontWeight:700, fontSize:'13px', color:'#555', marginBottom:'6px' }
const noteTa    = { width:'100%', padding:'10px 14px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', marginBottom:'16px', boxSizing:'border-box', fontFamily:"'Nunito',Arial,sans-serif", resize:'vertical', outline:'none' }
const aBtn      = (bg, color='#fff') => ({ padding:'11px 20px', background:bg, color, border:'none', borderRadius:'8px', fontWeight:700, cursor:'pointer', fontSize:'14px', fontFamily:"'Nunito',Arial,sans-serif" })
