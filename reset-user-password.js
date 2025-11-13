#!/usr/bin/env node
/**
 * Firebase Admin Password Reset Script
 * Sets a user's password directly without sending email
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
// Option 1: Use service account file
// admin.initializeApp({
//   credential: admin.credential.cert(require('./serviceAccountKey.json'))
// });

// Option 2: Use Firebase config (simpler - add your config)
admin.initializeApp({
  credential: admin.credential.cert({
    "projectId": "sei-team-trivia",
    "clientEmail": "YOUR_CLIENT_EMAIL_HERE",
    "privateKey": "YOUR_PRIVATE_KEY_HERE".replace(/\\n/g, '\n')
  })
});

async function resetPassword(email, newPassword) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set new password
    await admin.auth().updateUser(user.uid, {
      password: newPassword
    });
    
    console.log('✅ SUCCESS!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`User: ${email}`);
    console.log(`New Password: ${newPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now login as this user:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${newPassword}`);
    console.log('\n⚠️  Remember to tell the user their password was changed!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nCommon fixes:');
    console.error('  • Make sure the email exists in Firebase Auth');
    console.error('  • Check your service account credentials');
    console.error('  • Password must be at least 6 characters');
    process.exit(1);
  }
}

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Firebase Admin Password Reset');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nUsage:');
  console.log('  node reset-password.js <email> <new-password>');
  console.log('\nExample:');
  console.log('  node reset-password.js escerbo@sei.com TempPass123');
  console.log('\nNote: Password must be at least 6 characters\n');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ Password must be at least 6 characters');
  process.exit(1);
}

// Run the reset
resetPassword(email, password);
