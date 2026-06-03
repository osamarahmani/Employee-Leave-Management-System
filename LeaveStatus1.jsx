import { useEffect, useState } from 'react';
import axios from 'axios';

function LeaveStatus() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    axios.get(`http://localhost:5000/api/my-leaves/${user_id}`)
      .then(res => setLeaves(res.data));
  }, []);

  return (
    <div className="container">
      <h1>Leave Status</h1>
      <table>
        <tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr>
        {leaves.map(l => (
          <tr key={l.id}>
            <td>{l.leave_type}</td>
            <td>{l.from_date}</td>
            <td>{l.to_date}</td>
            <td>{l.days}</td>
            <td>{l.reason}</td>
            <td>{l.status}</td>
          </tr>
        ))}
      </table>
    </div>
  );
} 
export default LeaveStatus;