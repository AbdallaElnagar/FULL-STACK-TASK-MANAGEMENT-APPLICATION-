const User = require('../models/User');
const generateToken = require('../utils/generateToken');

class AuthService {
  async registerUser({ name, email, password, role }) {
    // Force role to Member unless caller is explicitly allowed or handled
    const assignedRole = role === 'Admin' ? 'Member' : (role || 'Member');

    // Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole
    });

    const token = generateToken(user);
    return { user: user.toJSON(), token };
  }

  async loginUser({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user);
    return { user: user.toJSON(), token };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user.toJSON();
  }
}

module.exports = new AuthService();
