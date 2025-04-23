import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Load Firebase credentials from environment variable
firebase_config = os.getenv('FIREBASE_CONFIG')

if not firebase_config:
    raise ValueError("FIREBASE_CONFIG environment variable is not set")

# 📢 Add this on **Line 10**
print(f"DEBUG: First 200 chars of FIREBASE_CONFIG: {firebase_config[:200]}")

cred = credentials.Certificate(json.loads(firebase_config))
firebase_admin.initialize_app(cred)

db = firestore.client()
