import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const RegistrationPage = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!name || !address || !phone || !email || !username || !password) {
      setMessage('Please fill in all fields.');
      return;
    }
    if(username === 'kalee123') {
      setMessage('Cannot register with admin username.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, phone, email, username, password }),
      });
      const data = await res.json();
      if(data.success) {
        alert('Registration successful! You can now login.');
        navigate('/');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Server error, please try again later.');
    }
  };
  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="street-address"
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
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
            autoComplete="new-password"
          />
        </label>
        <button type="submit">Register</button>
      </form>
      {message && <div className="error">{message}</div>}
      <p className="text-center">
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
};
export default RegistrationPage;

