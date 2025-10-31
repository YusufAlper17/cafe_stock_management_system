const db = require('../models');
const User = db.User;
const Store = db.Store;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/auth.config');

exports.register = async (req, res) => {
  try {
    const { username, password, role, store_id } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists!' });
    }

    // Check if store exists
    const store = await Store.findByPk(store_id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found!' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      store_id
    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        store_id: user.store_id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Error registering user!',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    // Find user with store information
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'store_name']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    // Store ID check
    if (!user.store_id || !user.store) {
      return res
        .status(400)
        .json({ message: 'User store information missing!' });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        store_id: user.store_id
      },
      config.secret,
      { expiresIn: '24h' }
    );

    // Successful login

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        store_id: user.store_id,
        store_name: user.store.store_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error during login!',
      error: error.message
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'store_name']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      store_id: user.store_id,
      store_name: user.store ? user.store.store_name : null
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      message: 'Error retrieving user profile!',
      error: error.message
    });
  }
};
