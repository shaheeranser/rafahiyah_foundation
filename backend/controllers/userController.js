import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register (Simplified for Admin/User)
export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Username and password are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Prepare user data (Password hashed in model pre-save)
    const userData = {
      username,
      password,
      role: role || 'user',
    };

    user = await User.create(userData);

    res.status(201).json({
      success: true,
      msg: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      msg: 'Server error',
      error: error.message
    });
  }
};

// Login with Username
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const token = jwt.sign({ _id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });

    res.json({
      success: true,
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
  try {
    const UserId = req.params.id
    await User.findByIdAndDelete(UserId);
    res.json({ msg: 'User deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update Admin Credentials
export const updateAdminCredentials = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update Username if provided and different
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ msg: 'Username already taken' });
      }
      user.username = username;
    }

    // Update Password if provided
    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
      }
      user.password = password; // Will be hashed by pre-save hook
    }

    await user.save();

    res.json({
      success: true,
      msg: 'Credentials updated successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Update credentials error:', error);
    res.status(500).json({ field: 'server', msg: 'Server error' });
  }
};


