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
      // Don't reveal if user exists - return same structure but without resetUrl
      return res.status(200).json({
        success: true,
        resetUrl: null,
        message: 'If an account exists, reset instructions have been sent'
      });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    console.log('🔑 [FORGOT DEBUG] Generated reset token:', resetToken);
    console.log('🔑 [FORGOT DEBUG] Token length:', resetToken.length);
    console.log('🔑 [FORGOT DEBUG] Token expiry:', resetTokenExpiry.toISOString());

    try {
      await user.update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
      });
      console.log('✅ [FORGOT DEBUG] Token updated in DB successfully');
    } catch (updateError) {
      console.error('❌ [FORGOT DEBUG] Failed to update token:', updateError);
      throw updateError;
    }

    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

    console.log('🔗 Reset URL:', resetUrl);

    return res.status(200).json({
      success: true,
      resetUrl,
      message: 'Password reset instructions generated'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse(res, 'Failed to send reset email', 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    console.log('🔐 [RESET DEBUG] Received request body:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? token.substring(0, 10) + '...' : 'none',
      hasNewPassword: !!newPassword,
      newPasswordLength: newPassword?.length
    });

    if (!token || !newPassword) {
      return errorResponse(res, 'Token and new password required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    console.log('🔐 [RESET DEBUG] Searching for user with token:', token.substring(0, 20) + '...');
    console.log('🔐 [RESET DEBUG] Current time:', new Date().toISOString());
    console.log('🔐 [RESET DEBUG] Checking expiry - should be > now');

    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      console.log('❌ [RESET DEBUG] No user found with given token. Checking if token exists but expired...');
      // Check if token exists at all (expired)
      const userExpired = await User.findOne({
        where: { reset_token: token }
      });
      if (userExpired) {
        console.log('⏰ [RESET DEBUG] Token found but expired. Expiry:', userExpired.reset_token_expiry);
      } else {
        console.log('🔍 [RESET DEBUG] Token not found in database at all');
      }
      return errorResponse(res, 'Invalid or expired token', 400);
    }

    console.log('✅ [RESET DEBUG] User found, token valid. User ID:', user.id);
    console.log('✅ [RESET DEBUG] Token expiry:', user.reset_token_expiry);

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

