// Helper script to format Firebase private key for Vercel environment variables
// Run with: node scripts/format-firebase-key.js

const fs = require('fs');
const path = require('path');

try {
  // Path to the service account file
  const serviceAccountPath = path.join(process.cwd(), 'chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json');
  
  // Read the service account file
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  // Extract the private key
  const privateKey = serviceAccount.private_key;
  
  // Format the private key for Vercel environment variables
  const formattedKey = privateKey.replace(/\n/g, '\\n');
  
  console.log('=== FIREBASE ENVIRONMENT VARIABLES FOR VERCEL ===');
  console.log('FIREBASE_PROJECT_ID=' + serviceAccount.project_id);
  console.log('FIREBASE_CLIENT_EMAIL=' + serviceAccount.client_email);
  console.log('FIREBASE_PRIVATE_KEY=' + JSON.stringify(formattedKey));
  console.log('\nℹ️ For the private key: Make sure to include the double quotes when adding to Vercel');
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Make sure the service account file exists in the project root');
} 