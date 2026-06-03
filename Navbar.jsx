import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const role     = localStorage.getItem('role')
  const name     = localStorage.getItem('user_name') || ''

  const logout = () => { localStorage.clear(); navigate('/') }

  const nb  = { background:'#1e3a5f', color:'#fff', padding:'0 28px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px', fontFamily:"'Nunito',Arial,sans-serif" }
  const btn = (bg='rgba(255,255,255,0.15)') => ({ background:bg, border:'none', color:'#fff', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', fontWeight:700, fontSize:'13px', marginLeft:'8px', fontFamily:"'Nunito',Arial,sans-serif" })

  return (
    <div style={nb}>
      <div style={{ fontSize:'20px', fontWeight:800 }}>
        📋 Leave Portal
        {role === 'admin' && <span style={{ fontSize:'12px', background:'rgba(255,255,255,0.2)', padding:'2px 10px', borderRadius:'20px', marginLeft:'10px' }}>ADMIN</span>}
      </div>
      <div style={{ display:'flex', alignItems:'center' }}>
        <span style={{ color:'#a8c8e8', fontSize:'14px', marginRight:'8px' }}>👤 {name}</span>
        {role === 'admin' ? (
          <>
            <button style={btn()} onClick={() => navigate('/admin')}>Dashboard</button>
          </>
        ) : (
          <>
            <button style={btn()} onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button style={btn()} onClick={() => navigate('/apply')}>Apply Leave</button>
            <button style={btn()} onClick={() => navigate('/status')}>My Leaves</button>
          </>
        )}
        <button style={btn('rgba(231,76,60,0.8)')} onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
