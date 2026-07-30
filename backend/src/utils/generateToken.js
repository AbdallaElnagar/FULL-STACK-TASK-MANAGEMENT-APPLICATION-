const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'fallback_secret_key_123',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  );
};

module.exports = generateToken;
