// server/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import config from '../../config/config.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    // Generate JWT with user ID and role
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      config.jwtSecret, 
      { expiresIn: '8h' }
    );
    // Include user info (e.g., name, role) in response for UI display
    res.json({ token, user: { 
      id: user._id, 
      name: `${user.firstName} ${user.lastName}`, 
      role: user.role 
    }});
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
