import { createContext, useContext, useEffect, useState } from "react"
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "../lib/firebase"
import { loadCloudProgress, saveUserProfile } from "../lib/progressService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)

      if (u) {
        // Sync progress from cloud on login
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
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)