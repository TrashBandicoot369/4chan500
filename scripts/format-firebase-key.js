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
  
  // Create variables in the format needed for different environments
  const projectId = serviceAccount.project_id;
  const clientEmail = serviceAccount.client_email;
  
  // For Vercel UI (include quotes for the private key)
  const vercelPrivateKey = JSON.stringify(formattedKey);
  
  // For .env.local file (escape quotes)
  const envFilePrivateKey = formattedKey.replace(/"/g, '\\"');
  
  // Output for Vercel Environment Variables UI
  console.log('=== FIREBASE ENVIRONMENT VARIABLES FOR VERCEL UI ===');
  console.log('FIREBASE_PROJECT_ID=' + projectId);
  console.log('FIREBASE_CLIENT_EMAIL=' + clientEmail);
  console.log('FIREBASE_PRIVATE_KEY=' + vercelPrivateKey);
  console.log('\nIMPORTANT: For the private key, make sure to include the double quotes when adding to Vercel!');
  
  // Create a .env.local file for local development
  const envContent = `# Firebase Admin SDK
FIREBASE_PROJECT_ID=${projectId}
FIREBASE_CLIENT_EMAIL=${clientEmail}
FIREBASE_PRIVATE_KEY="${envFilePrivateKey}"
`;

  // Write to .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Created .env.local file for local development at:', envPath);
  
  console.log('\n=== TROUBLESHOOTING TIPS ===');
  console.log('1. In Vercel, add these environment variables exactly as shown above');
  console.log('2. Make sure the private key includes quotes when adding to Vercel');
  console.log('3. After adding variables, redeploy your application');
  console.log('4. Check Vercel Functions logs for any Firebase initialization errors');
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Make sure the service account file exists in the project root');
} 