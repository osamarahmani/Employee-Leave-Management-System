import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login1() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      if (res.data.success) {
        // save user info in localStorage
        localStorage.setItem('user_id',   res.data.user_id);
        localStorage.setItem('user_name', res.data.name);
        localStorage.setItem('role',      res.data.role);

        if (res.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  // your existing return JSX stays same
  // just connect button to handleLogin
  // and inputs to setEmail / setPassword
}
export default Login1;