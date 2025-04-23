import os, json, base64, firebase_admin
from firebase_admin import credentials, firestore

# Read Base-64 secret from Railway
b64 = os.getenv("FIREBASE_CONFIG")
if not b64:
    raise RuntimeError("FIREBASE_CONFIG not set")

# Decode back to JSON
cfg = json.loads(base64.b64decode(b64).decode("utf-8"))

# Init Firebase
cred = credentials.Certificate(cfg)
firebase_admin.initialize_app(cred)
db = firestore.client()
