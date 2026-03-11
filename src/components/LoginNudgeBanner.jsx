import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./LoginNudgeBanner.css"

export default function LoginNudgeBanner() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show if user is logged in
    if (user) return

    // Check if banner was dismissed this session
    const dismissed = sessionStorage.getItem("loginBannerDismissed")
    if (dismissed) return

    // Show banner after 3 seconds (let user settle in)
    const timer = setTimeout(() => {
      setVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [user])

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem("loginBannerDismissed", "true")
  }

  const handleLogin = () => {
    sessionStorage.setItem("loginBannerDismissed", "true")
    navigate("/login")
  }

  // Don't render if not visible or user is logged in
  if (!visible || user) return null

  return (
    <div className="login-nudge-banner">
      <div className="login-nudge-content">
        <i className="fa-solid fa-cloud-arrow-up login-nudge-icon"></i>
        <span className="login-nudge-text">سجّل دخولك لحفظ تقدمك عبر جميع أجهزتك</span>
        <button className="login-nudge-btn" onClick={handleLogin}>
          <i className="fa-solid fa-right-to-bracket"></i>
          تسجيل الدخول
        </button>
      </div>
      <button className="login-nudge-close" onClick={handleDismiss} aria-label="إغلاق">
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  )
}