import { useAuth } from "../context/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#fff", direction: "rtl"
    }}>
      <div style={{ textAlign: "center", color: "#c2b098" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "2rem" }}></i>
        <p style={{ marginTop: "1rem", fontFamily: "Amiri, serif", fontSize: "1rem", color: "#564734" }}>
          جاري التحميل...
        </p>
      </div>
    </div>
  )

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return children
}