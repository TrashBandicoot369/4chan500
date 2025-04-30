// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCW0nw5BVdBPpVmdVCZZbRCH9HxZX8p6eQ",
  authDomain: "chan500.firebaseapp.com",
  projectId: "chan500",
  storageBucket: "chan500.appspot.com",
  messagingSenderId: "95307635077",
  appId: "1:95307635077:web:60ed7ee7d03c8cb7c36c8e"
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db } 