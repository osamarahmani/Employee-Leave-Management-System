import { useState } from 'react';
import axios from 'axios';

function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    const user_id = localStorage.getItem('user_id');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/apply',
        {
          user_id,
          leave_type: leaveType,
          from_date: fromDate,
          to_date: toDate,
          reason
        }
      );

      if (res.data.success) {
        alert('Leave Applied Successfully');
      }
    } catch (err) {
      alert('Something went wrong');
    }
  };

  return (
    <div className="container">
      <h1>Apply Leave</h1>

      <input
        type="text"
        placeholder="Leave Type"
        value={leaveType}
        onChange={(e) => setLeaveType(e.target.value)}
      />

      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      <textarea
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Submit Leave
      </button>
    </div>
  );
}

export default ApplyLeave;