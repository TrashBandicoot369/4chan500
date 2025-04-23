import os
import json
import base64
import firebase_admin
from firebase_admin import credentials, firestore

# 1. Get the Base-64 string (must exist in Railway Variables)
b64 = os.getenv("FIREBASE_CONFIG_B64")
if not b64:
    raise RuntimeError("FIREBASE_CONFIG_B64 not set")

# 2. Decode Base-64 back into a JSON dict
cfg = json.loads(base64.b64decode(b64).decode("utf-8"))

# 3. Initialise Firebase Admin
cred = credentials.Certificate(cfg)
firebase_admin.initialize_app(cred)

# 4. Firestore client you can import elsewhere
db = firestore.client()
