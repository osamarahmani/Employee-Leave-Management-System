import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login           from './pages/Login.jsx'
import EmployeeDash    from './pages/EmployeeDash.jsx'
import ApplyLeave      from './pages/ApplyLeave.jsx'
import LeaveStatus     from './pages/LeaveStatus.jsx'
import AdminDash       from './pages/AdminDash.jsx'
import EmployeeProfile from './pages/EmployeeProfile.jsx'
import Register from './pages/Register.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                      element={<Login />} />
        <Route path="/dashboard"             element={<EmployeeDash />} />
        <Route path="/apply"                 element={<ApplyLeave />} />
        <Route path="/status"                element={<LeaveStatus />} />
        <Route path="/admin"                 element={<AdminDash />} />
        <Route path="/admin/employee/:id"    element={<EmployeeProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="*"                      element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
