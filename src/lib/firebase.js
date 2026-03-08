import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAH9z2iOeBWwWXjGhFN6evUiGYfM5e2haA",
  authDomain: "tadabur-app.firebaseapp.com",
  projectId: "tadabur-app",
  storageBucket: "tadabur-app.firebasestorage.app",
  messagingSenderId: "370901413086",
  appId: "1:370901413086:web:b8c04f6a3f8e1ff981a64f"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app