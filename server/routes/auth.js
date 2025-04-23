const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByUsername , createUser} = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  const user = await findUserByUsername(username);
  
  console.log('User:', user);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (user.role !== role) {
    return res.status(403).json({ message: 'Invalid role' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, "GOODWORK", {
    expiresIn: '1h',
  });
  res.json({ token, role: user.role , id: user.id });
});

// Add this to your existing auth routes file
router.post('/signup', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Create new user
    const newUser = await createUser(username, password, role);
    
    // Generate token for automatic login after signup
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, "GOODWORK", {
      expiresIn: '1h',
    });
    
    res.status(201).json({ 
      message: 'User created successfully',
      token,
      role: newUser.role
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;