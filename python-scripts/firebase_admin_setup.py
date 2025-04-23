import os
import json
import base64
import firebase_admin
from firebase_admin import credentials, firestore

# Load Base64-encoded Firebase config
firebase_config_b64 = os.getenv('FIREBASE_CONFIG')

if not firebase_config_b64:
    raise ValueError("FIREBASE_CONFIG environment variable is not set")

# Decode from Base64 back to JSON string
firebase_config_json = base64.b64decode(firebase_config_b64).decode('utf-8')

cred = credentials.Certificate(json.loads(firebase_config_json))
firebase_admin.initialize_app(cred)

db = firestore.client()
