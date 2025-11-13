// Firebase Admin Password Reset Utility
// Run this in your Firebase Functions or Node.js environment with Admin SDK

const admin = require('firebase-admin');

// Initialize Admin SDK (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Or use service account:
    // credential: admin.credential.cert(require('./serviceAccountKey.json'))
  });
}

/**
 * Reset a user's password
 * @param {string} email - User's email address
 * @param {string} newPassword - New password to set (min 6 characters)
 */
async function resetUserPassword(email, newPassword) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Update password
    await admin.auth().updateUser(user.uid, {
      password: newPassword
    });
    
    console.log(`✓ Password updated successfully for ${email}`);
    console.log(`  User ID: ${user.uid}`);
    console.log(`  New password: ${newPassword}`);
    console.log(`\nYou can now login as this user with:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${newPassword}`);
    
    return true;
  } catch (error) {
    console.error('✗ Error updating password:', error.message);
    return false;
  }
}

// Example usage:
// resetUserPassword('user@sei.com', 'TempPassword123');

// For command line usage:
if (require.main === module) {
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.log('Usage: node reset-password.js <email> <new-password>');
    console.log('Example: node reset-password.js user@sei.com TempPass123');
    process.exit(1);
  }
  
  resetUserPassword(email, password)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { resetUserPassword };
