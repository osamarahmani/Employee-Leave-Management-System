import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Employee Dashboard</h1>

      <button onClick={() => navigate("/applyleave")}>
        Apply Leave
      </button>

      <br /><br />

      <button onClick={() => navigate("/status")}>
        View Status
      </button>

      <br /><br />

      <button onClick={() => navigate("/")}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;