const { User, NotificationSettings } = require('../models');
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

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, formatUser(user));
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Failed to get profile', 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, phone, location, avatarUrl, password } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse(res, 'Email already in use', 400);
      }
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      location: location !== undefined ? location : user.location,
      avatar_url: avatarUrl !== undefined ? avatarUrl : user.avatar_url,
      password_hash: password || user.password_hash
    });

    return successResponse(res, formatUser(user), 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Failed to update profile', 500);
  }
};

module.exports = {
  getProfile,
  updateProfile
};