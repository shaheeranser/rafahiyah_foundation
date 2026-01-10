import express from 'express';
import {
  registerUser, loginUser, getProfile,
  getAllUsers, deleteUser, updateAdminCredentials
} from '../controllers/userController.js';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

// Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-for-development');
      req.user = await User.findById(decoded._id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ msg: 'Not authorized as an admin' });
  }
};

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User routes
router.get('/profile', protect, getProfile);
router.put('/admin/update', protect, updateAdminCredentials);

// Admin routes
router.get('/getalluser', protect, isAdmin, getAllUsers);
router.delete('/delete/:id', protect, isAdmin, deleteUser);

export default router;
