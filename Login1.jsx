import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const navigate              = useNavigate()
  const [email,    setEmail]  = useState('')
  const [password, setPass]   = useState('')
  const [error,    setError]  = useState('')
  const [loading,  setLoad]   = useState(false)

  const doLogin = async () => {
    if (!email || !password) { setError('Please enter email and password.'); return }
    setLoad(true); setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password })
      localStorage.setItem('user_id',   res.data.user_id)
      localStorage.setItem('user_name', res.data.name)
      localStorage.setItem('role',      res.data.role)
      localStorage.setItem('dept',      res.data.dept)
      res.data.role === 'admin' ? navigate('/admin') : navigate('/dashboard')
    } catch {
      setError('Invalid email or password. Please try again.')
    }
    setLoad(false)
  }


  return (
    <div style={pg}>
      <div style={box}>
        <h1 style={h1}>📋 Leave Portal</h1>
        <p style={sub}>Employee Leave Management System</p>

        {error && <div style={errBox}>⚠️ {error}</div>}

        <label style={lbl}>Email Address</label>
        <input style={inp} type="email" placeholder="you@company.com"
          value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doLogin()} />

        <label style={lbl}>Password</label>
        <input style={inp} type="password" placeholder="Enter your password"
          value={password} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doLogin()} />

        <button style={btn} onClick={doLogin}>
          {loading ? 'Logging in...' : 'Login →'}
        </button>
      </div>
    </div>
  )
}

/* ── styles ── */
const pg      = { minHeight:'100vh', background:'linear-gradient(135deg,#1e3a5f,#2d6a9f)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Nunito',Arial,sans-serif" }
const box     = { background:'#fff', borderRadius:'16px', padding:'40px 36px', width:'100%', maxWidth:'420px', boxShadow:'0 10px 40px rgba(0,0,0,0.2)' }
const h1      = { textAlign:'center', color:'#1e3a5f', fontSize:'26px', fontWeight:800, marginBottom:'6px' }
const sub     = { textAlign:'center', color:'#888', fontSize:'14px', marginBottom:'28px' }
const lbl     = { display:'block', fontWeight:700, fontSize:'13px', color:'#555', marginBottom:'6px' }
const inp     = { width:'100%', padding:'11px 14px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', marginBottom:'16px', boxSizing:'border-box', fontFamily:"'Nunito',Arial,sans-serif", outline:'none' }
const btn     = { width:'100%', padding:'13px', background:'#2d6a9f', color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',Arial,sans-serif" }
const errBox  = { background:'#fdecea', border:'1px solid #f5b7b1', color:'#c0392b', padding:'10px 14px', borderRadius:'8px', marginBottom:'14px', fontSize:'13px' }
