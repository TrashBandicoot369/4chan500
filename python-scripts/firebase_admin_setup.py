import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

# Check if running in production (Vercel) or development
if os.environ.get('VERCEL_ENV'):
    # In production, use environment variables
    # Create a credential dictionary from environment variables
    try:
        # Check if FIREBASE_SERVICE_ACCOUNT is set as a JSON string
        if os.environ.get('FIREBASE_SERVICE_ACCOUNT'):
            service_account_info = json.loads(os.environ.get('FIREBASE_SERVICE_ACCOUNT', '{}'))
            cred = credentials.Certificate(service_account_info)
        else:
            # Fallback to individual environment variables
            service_account_info = {
                "type": "service_account",
                "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
                "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": os.environ.get("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
                "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
                "auth_uri": os.environ.get("FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"),
                "token_uri": os.environ.get("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
                "auth_provider_x509_cert_url": os.environ.get("FIREBASE_AUTH_PROVIDER_CERT_URL", "https://www.googleapis.com/oauth2/v1/certs"),
                "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_CERT_URL")
            }
            cred = credentials.Certificate(service_account_info)
    except Exception as e:
        print(f"Error initializing Firebase from environment variables: {e}")
        # Initialize with default credentials as a fallback
        cred = credentials.ApplicationDefault()
else:
    # In development, use the local JSON file
    try:
        cred = credentials.Certificate("chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json")
    except Exception as e:
        print(f"Error loading Firebase service account file: {e}")
        # Initialize with default credentials as a fallback
        cred = credentials.ApplicationDefault()

# Initialize Firebase app (only if not already initialized)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client() 
