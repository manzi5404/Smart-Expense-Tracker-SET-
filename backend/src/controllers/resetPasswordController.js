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
    // STEP 1 — REQUEST BODY VERIFICATION
    console.log('========== STEP 1: REQUEST BODY VERIFICATION ==========');
    console.log('REQ BODY (raw):', JSON.stringify(req.body));
    const { token, newPassword } = req.body;
    console.log('TOKEN RECEIVED:', token);
    console.log('TOKEN LENGTH:', token?.length);
    console.log('NEWPASSWORD RECEIVED:', newPassword ? 'present' : 'missing');
    console.log('========================================================');

    if (!token || !newPassword) {
      return errorResponse(res, 'Token and new password required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters', 400);
    }

    // STEP 2 — DATABASE LOOKUP VERIFICATION
    console.log('========== STEP 2: DATABASE LOOKUP VERIFICATION ==========');
    console.log('LOOKING UP TOKEN:', token);
    console.log('LOOKING UP TOKEN (first 20 chars):', token.substring(0, 20) + '...');
    console.log('Current server time:', new Date().toISOString());
    console.log('Checking expiry: reset_token_expiry > now?');

    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    console.log('USER FOUND (with valid expiry):', user ? 'YES' : 'NO');

    if (!user) {
      console.log('❌ No user found with given token AND valid expiry. Performing fallback check...');
      // Check if token exists at all (maybe expired)
      const userExpired = await User.findOne({
        where: { reset_token: token }
      });
      if (userExpired) {
        console.log('⏰ TOKEN FOUND BUT EXPIRED. Expiry:', userExpired.reset_token_expiry);
        console.log('⏰ Current time:', new Date().toISOString());
        console.log('⏰ Expired? EXPIRY <= NOW:', new Date(userExpired.reset_token_expiry) <= new Date());
      } else {
        console.log('🔍 TOKEN NOT FOUND IN DATABASE AT ALL');
        console.log('🔍 This means: (a) token never saved, (b) token overwritten, or (c) wrong token value');
      }
      return errorResponse(res, 'Invalid or expired token', 400);
    }

    console.log('✅ USER FOUND with valid token');
    console.log('✅ User ID:', user.id);
    console.log('✅ User email:', user.email);
    console.log('✅ Token expiry (valid until):', user.reset_token_expiry);

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

