import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar.jsx'

export default function Register() {
  const navigate               = useNavigate()
  const [name,     setName]    = useState('')
  const [email,    setEmail]   = useState('')
  const [password, setPass]    = useState('')
  const [dept,     setDept]    = useState('')
  const [role,     setRole]    = useState('employee')
  const [success,  setOk]      = useState('')
  const [error,    setErr]     = useState('')
  const [loading,  setLd]      = useState(false)

  const submit = async () => {
    if (!name.trim())     { setErr('Please enter full name.');      return }
    if (!email.trim())    { setErr('Please enter email.');          return }
    if (!password.trim()) { setErr('Please enter password.');       return }
    if (!dept.trim())     { setErr('Please enter department.');     return }

    setLd(true); setErr(''); setOk('')
    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        name, email, password, role, department: dept
      })
      if (res.data.success) {
        setOk(`✅ Account created for ${name} successfully!`)
        setName(''); setEmail(''); setPass(''); setDept(''); setRole('employee')
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setErr('❌ ' + err.response.data.message)
      } else {
        setErr('❌ Could not connect to server. Make sure Flask is running.')
      }
    }
    setLd(false)
  }

  return (
    <div style={pg}>
      <Navbar />
      <div style={content}>
        <h2 style={title}>Create New Account</h2>
        <p style={sub}>Add a new employee or admin to the system</p>

        <div style={card}>
          <div style={cardH}>New User Details</div>
          <div style={cardB}>

            {success && <div style={okBox}>{success}</div>}
            {error   && <div style={errBox}>{error}</div>}

            <div style={row2}>
              <div>
                <label style={lbl}>Full Name</label>
                <input style={inp} type="text" placeholder="e.g. John Doe"
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={lbl}>Department</label>
                <input style={inp} type="text" placeholder="e.g. Finance"
                  value={dept} onChange={e => setDept(e.target.value)} />
              </div>
            </div>

            <label style={lbl}>Email Address</label>
            <input style={inp} type="email" placeholder="e.g. john@company.com"
              value={email} onChange={e => setEmail(e.target.value)} />

            <label style={lbl}>Password</label>
            <input style={inp} type="password" placeholder="Set a password"
              value={password} onChange={e => setPass(e.target.value)} />

            <label style={lbl}>Role</label>
            <select style={inp} value={role} onChange={e => setRole(e.target.value)}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

            {/* PREVIEW CARD */}
            {name && (
              <div style={preview}>
                <div style={previewAvatar}>{name.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight:800, color:'#1e3a5f' }}>{name}</div>
                  <div style={{ fontSize:'13px', color:'#888' }}>{email || 'No email yet'}</div>
                  <div style={{ fontSize:'12px', color:'#2d6a9f', marginTop:'2px' }}>
                    {dept || 'No dept'} · {role.charAt(0).toUpperCase()+role.slice(1)}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
              <button style={submitBtn} onClick={submit}>
                {loading ? 'Creating...' : '+ Create Account'}
              </button>
              <button style={backBtn} onClick={() => navigate('/admin')}>
                ← Back to Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const pg          = { minHeight:'100vh', background:'#f0f4f8', fontFamily:"'Nunito',Arial,sans-serif" }
const content     = { padding:'28px', maxWidth:'620px', margin:'0 auto' }
const title       = { fontSize:'22px', fontWeight:800, color:'#1e3a5f', marginBottom:'4px' }
const sub         = { color:'#888', fontSize:'14px', marginBottom:'24px' }
const card        = { background:'#fff', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }
const cardH       = { padding:'16px 20px', borderBottom:'1px solid #eee', fontWeight:800, color:'#1e3a5f', fontSize:'16px' }
const cardB       = { padding:'24px' }
const lbl         = { display:'block', fontWeight:700, fontSize:'13px', color:'#555', marginBottom:'6px' }
const inp         = { width:'100%', padding:'11px 14px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', marginBottom:'16px', boxSizing:'border-box', fontFamily:"'Nunito',Arial,sans-serif", outline:'none' }
const row2        = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }
const submitBtn   = { padding:'12px 28px', background:'#2d6a9f', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',Arial,sans-serif" }
const backBtn     = { padding:'12px 28px', background:'#ecf0f1', color:'#555', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',Arial,sans-serif" }
const okBox       = { background:'#eafaf1', border:'1px solid #a9dfbf', color:'#1e8449', padding:'12px 14px', borderRadius:'8px', marginBottom:'16px', fontSize:'13px', fontWeight:700 }
const errBox      = { background:'#fdecea', border:'1px solid #f5b7b1', color:'#c0392b', padding:'12px 14px', borderRadius:'8px', marginBottom:'16px', fontSize:'13px' }
const preview     = { background:'#f0f4f8', borderRadius:'10px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }
const previewAvatar = { width:'44px', height:'44px', borderRadius:'50%', background:'#2d6a9f', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:800, flexShrink:0 }