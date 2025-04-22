import firebase_admin
from firebase_admin import credentials, firestore

# Load service account key
cred = credentials.Certificate("chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json")

# Initialize Firebase app (only if not already initialized)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client() 