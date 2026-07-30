const authService = require('../services/auth.service');
const { successResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser({ name, email, password, role });
    return successResponse(res, 201, 'User registered successfully', result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    return successResponse(res, 200, 'User profile retrieved', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
