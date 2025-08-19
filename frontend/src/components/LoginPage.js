import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!username || !password) {
      setMessage('Please enter both username and password.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        navigate(data.isAdmin ? '/admin' : '/home');
      } else {
        if (data.message === 'User not registered') {
          if (window.confirm('User not registered. Do you want to register now?')) {
            navigate('/register');
          }
        } else {
          setMessage(data.message);
        }
      }
    } catch (error) {
      setMessage('Server error, please try again later.');
    }
  };

  return (
    <>

      <div className="container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button type="submit">Login</button>
        </form>
        {message && <div className="error">{message}</div>}
        <p className="text-center">
          Not registered? <Link to="/register">Register here</Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
