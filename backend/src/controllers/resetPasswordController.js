const { User } = require('../models');
const crypto = require('crypto');
const { Resend } = require('resend');
const { successResponse, errorResponse } = require('../utils/response');

let resend = null;
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_')) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend initialized with API key:', process.env.RESEND_API_KEY.substring(0, 15) + '...');
} else {
  console.warn('⚠️ RESEND_API_KEY is missing or invalid. Password reset emails disabled.');
  console.warn('Current value:', process.env.RESEND_API_KEY);
}

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

    if (!resend) {
      console.warn('⚠️ Cannot send email - Resend not initialized');
      return successResponse(res, null, 'If an account exists, reset instructions have been sent');
    }

     const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
     const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;
    
    console.log('📧 Sending password reset email to:', user.email);
    
    try {
      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: user.email,
        subject: 'Reset Your Password - Smart Expense Tracker',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Reset Your Password</h2>
            <p>You requested a password reset for your Smart Expense Tracker account.</p>
            <p>Click the button below to set a new password (link expires in 30 minutes):</p>
            <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">Reset Password</a>
            <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
              If you didn't request this, please ignore this email.
            </p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="font-size: 12px; color: #6b7280;">Smart Expense Tracker</p>
          </div>
        `
      });
      
      console.log('📧 Email send result:', emailResult);
      
      if (emailResult.error) {
        console.error('❌ Resend error:', emailResult.error);
        return errorResponse(res, 'Failed to send reset email', 500);
      }
      
      return successResponse(res, null, 'Password reset email sent');
    } catch (emailError) {
      console.error('❌ Email send exception:', emailError);
      return errorResponse(res, 'Failed to send reset email', 500);
    }
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

