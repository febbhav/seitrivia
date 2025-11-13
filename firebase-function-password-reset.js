// Firebase Cloud Function for Admin Password Reset
// Add this to your functions/index.js file

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Admin SDK if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Admin-only function to reset user passwords
 * Allows admins to set a temporary password to login as users
 */
exports.adminResetPassword = functions.https.onCall(async (data, context) => {
  // Check if request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to reset passwords'
    );
  }

  // Check if user is admin (fshah@sei.com)
  const adminEmail = 'fshah@sei.com';
  const callerEmail = context.auth.token.email;
  
  if (callerEmail.toLowerCase() !== adminEmail.toLowerCase()) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can reset passwords'
    );
  }

  // Validate input
  const { userId, newPassword } = data;
  
  if (!userId || !newPassword) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'userId and newPassword are required'
    );
  }

  if (newPassword.length < 6) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must be at least 6 characters'
    );
  }

  try {
    // Update the user's password
    await admin.auth().updateUser(userId, {
      password: newPassword
    });

    // Get user details for logging
    const user = await admin.auth().getUser(userId);

    // Log the action (optional - for audit trail)
    await admin.firestore().collection('admin_actions').add({
      action: 'password_reset',
      adminEmail: callerEmail,
      targetUserId: userId,
      targetUserEmail: user.email,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: `Password reset successfully for ${user.email}`,
      userEmail: user.email
    };

  } catch (error) {
    console.error('Error resetting password:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to reset password: ' + error.message
    );
  }
});
