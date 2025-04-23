import os, json, base64, firebase_admin
from firebase_admin import credentials, firestore

# 1. Get Base-64 string from Railway
b64 = os.getenv("FIREBASE_CONFIG_B64")       # <<< this MUST match the var name
if not b64:
    raise RuntimeError("FIREBASE_CONFIG_B64 not set")

# 2. Turn Base-64 back into a JSON dict
cfg = json.loads(base64.b64decode(b64).decode("utf-8"))

# 3. Initialise Firebase
cred = credentials.Certificate(cfg)
firebase_admin.initialize_app(cred)
db = firestore.client()
