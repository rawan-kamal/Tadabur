// ══════════════════════════════════════════════════════
// AUTH CONTEXT
// Uses signInWithPopup — COOP console warnings are harmless
// Login guard prevents concurrent popups (auth/cancelled-popup-request)
// ══════════════════════════════════════════════════════
import { createContext, useContext, useEffect, useRef, useState } from "react"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth"
import { auth } from "../lib/firebase"
import { loadCloudProgress, saveUserProfile, clearLocalProgress } from "../lib/progressService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const loginInProgress = useRef(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)

      if (u) {
        try {
          await loadCloudProgress(u.uid)
          await saveUserProfile(u.uid, u)
        } catch (err) {
          console.error("Failed to sync progress:", err)
        }
      }

      setLoading(false)
    })
    return unsub
  }, [])

  const login = async () => {
    if (loginInProgress.current) return
    loginInProgress.current = true
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err) {
      console.error("Login error:", err.code, err.message)
    } finally {
      loginInProgress.current = false
    }
  }

  const logout = () => {
    clearLocalProgress()
    signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)