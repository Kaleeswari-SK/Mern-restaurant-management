// userRoutes.js (ES module version)
import express from 'express';
import User from '../models/User.js'; // Add `.js` to support ESM import

const router = express.Router();

// Admin credentials
const ADMIN_USERNAME = 'kalee123';
const ADMIN_PASSWORD = '090704';

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ success: true, isAdmin: true, message: 'Admin login successful' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, isAdmin: false, message: 'User not registered' });
    }
    if (user.password !== password) {
      return res.json({ success: false, isAdmin: false, message: 'Invalid password' });
    }
    return res.json({ success: true, isAdmin: false, message: 'User login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, address, phone, email, username, password } = req.body;
  if (!name || !address || !phone || !email || !username || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (username === ADMIN_USERNAME) {
    return res.json({ success: false, message: 'This username is not allowed' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: 'Username already taken' });
    }
    const newUser = new User({ name, address, phone, email, username, password });
    await newUser.save();
    return res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; // ✅ Required for ES module support
