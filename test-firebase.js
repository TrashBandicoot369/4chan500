const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Read service account file
    const serviceAccountPath = path.join(__dirname, 'chan500-firebase-adminsdk-fbsvc-aa307e321e.json');
    console.log('Looking for service account at:', serviceAccountPath);
    
    if (!fs.existsSync(serviceAccountPath)) {
      console.error('Service account file does not exist at path:', serviceAccountPath);
      return;
    }
    
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log('Service account loaded successfully');
    
    // Initialize Firebase
    const app = initializeApp({
      credential: cert(serviceAccount),
    });
    
    console.log('Firebase Admin initialized successfully');
    
    // Get Firestore instance
    const db = getFirestore(app);
    console.log('Firestore instance created');
    
    // Test query
    console.log('Querying Firestore...');
    const snapshot = await db.collection('memes').limit(1).get();
    
    console.log(`Query successful, found ${snapshot.size} documents`);
    
    if (snapshot.size > 0) {
      console.log('Sample document data:', snapshot.docs[0].data());
    }
    
    console.log('Firebase connection test completed successfully');
  } catch (error) {
    console.error('Error testing Firebase connection:', error);
  }
}

testFirebaseConnection(); 