const { User } = require('../models');
const crypto = require('crypto');
const { successResponse, errorResponse } = require('../utils/response');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 'Email is required', 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return successResponse(res, null, 'If an account exists, reset instructions have been sent');
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await user.update({
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry
    });

    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

    console.log('🔑 Reset token generated for:', user.email);
    console.log('🔗 Reset URL:', resetUrl);

    return successResponse(res, { resetUrl }, 'Password reset instructions generated');
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse(res, 'Failed to send reset email', 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return errorResponse(res, 'Token and new password required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return errorResponse(res, 'Invalid or expired token', 400);
    }

    await user.update({
      password_hash: newPassword,
      reset_token: null,
      reset_token_expiry: null
    });

    return successResponse(res, null, 'Password reset successful');
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse(res, 'Failed to reset password', 500);
  }
};

module.exports = {
  forgotPassword,
  resetPassword
};

