import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard1() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/all-leaves')
      .then(res => setLeaves(res.data));
  }, []);

  const handleAction = async (id, status) => {
    const note = prompt('Add a note (optional):') || '';
    await axios.post(`http://localhost:5000/api/action/${id}`, { status, note });
    // refresh list
    const res = await axios.get('http://localhost:5000/api/all-leaves');
    setLeaves(res.data);
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <table>
        <tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Action</th></tr>
        {leaves.map(l => (
          <tr key={l.id}>
            <td>{l.emp_name}</td>
            <td>{l.leave_type}</td>
            <td>{l.from_date}</td>
            <td>{l.to_date}</td>
            <td>{l.reason}</td>
            <td>{l.status}</td>
            <td>
              {l.status === 'pending' && <>
                <button onClick={() => handleAction(l.id, 'approved')}>Approve</button>
                <button onClick={() => handleAction(l.id, 'declined')}>Decline</button>
              </>}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
} 
export default AdminDashboard1;