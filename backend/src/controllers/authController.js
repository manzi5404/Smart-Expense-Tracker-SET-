const { User, NotificationSettings } = require('../models');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  location: user.location,
  avatarUrl: user.avatar_url,
  createdAt: user.created_at
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email and password are required', 400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }

    const user = await User.create({
      name,
      email,
      password_hash: password
    });

    await NotificationSettings.create({
      user_id: user.id
    });

    const token = generateToken(user.id);

    return successResponse(res, {
      user: formatUser(user),
      token
    }, 'User registered successfully', 201);
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, 'Registration failed', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user.id);

    return successResponse(res, {
      user: formatUser(user),
      token
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Login failed', 500);
  }
};

module.exports = {
  register,
  login
};