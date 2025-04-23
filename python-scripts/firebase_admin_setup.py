import os
import json
import base64
import firebase_admin
from firebase_admin import credentials, firestore

# ──────────────────────────────────────────────────────────────
# Show us whether the variable is visible inside the container
print(
    "DEBUG-FIREBASE_CONFIG_B64 length:",
    len(os.getenv("FIREBASE_CONFIG_B64") or "")
)
# ──────────────────────────────────────────────────────────────

# 1. Get the Base-64 string that Railway should provide
b64 = os.getenv("FIREBASE_CONFIG_B64")       # ← the variable name we expect
if not b64:
    raise RuntimeError("FIREBASE_CONFIG_B64 not set")

# 2. Decode Base-64 back to JSON
cfg = json.loads(base64.b64decode(b64).decode("utf-8"))

# 3. Initialise Firebase
cred = credentials.Certificate(cfg)
firebase_admin.initialize_app(cred)
db = firestore.client()
