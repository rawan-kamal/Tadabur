import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sparkles from "../components/Sparkles"
import "./LoginPage.css"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login } = useAuth()
  // FIX: track in-progress login to prevent double-click opening two popups,
  // which causes Firebase to cancel the first with auth/cancelled-popup-request
  const [loggingIn, setLoggingIn] = useState(false)

  const from = location.state?.from?.pathname || "/courses"

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user])

  const handleLogin = async () => {
    if (loggingIn) return   // already in progress — ignore extra clicks
    setLoggingIn(true)
    try {
      await login()
    } catch (err) {
      // Only log errors that aren't the harmless "another popup opened" race
      if (err?.code !== "auth/cancelled-popup-request") {
        console.error("Login error:", err)
      }
      setLoggingIn(false)   // re-enable only on real error
    }
    // on success, useEffect above navigates away so no need to reset
  }

  return (
    <div className="lg-page">
      <Sparkles />

      <button className="lg-back-btn" onClick={() => navigate("/")}>
        <i className="fa-solid fa-arrow-right"></i>
        الرئيسية
      </button>

      <div className="lg-card">
        <div className="lg-logo-wrap">
          <img
            src="./logo.png"
            alt="تدبر"
            onError={e => { e.target.style.display = "none" }}
          />
          <span className="lg-logo-text">تدبّر</span>
        </div>

        <h1 className="lg-title">مرحباً بك في رحلة التدبر</h1>
        <p className="lg-desc">
          سجّل دخولك لتبدأ رحلتك مع تدبر القرآن الكريم وتتبّع تقدمك في الدورات
        </p>

        <div className="lg-divider" />

        {/* FIX: disabled + visual feedback while popup is open */}
        <button
          className={`lg-google-btn ${loggingIn ? "lg-google-btn--loading" : ""}`}
          onClick={handleLogin}
          disabled={loggingIn}
        >
          {loggingIn
            ? <><i className="fa-solid fa-spinner fa-spin"></i> جارٍ التسجيل...</>
            : <>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                />
                تسجيل الدخول بحساب Google
              </>
          }
        </button>

        <div className="lg-features">
          <span className="lg-feature">
            <i className="fa-solid fa-lock"></i> آمن ومجاني
          </span>
          <span className="lg-feature">
            <i className="fa-solid fa-chart-line"></i> تتبع تقدمك
          </span>
          <span className="lg-feature">
            <i className="fa-solid fa-cloud"></i> محفوظ تلقائياً
          </span>
        </div>

        <p className="lg-footer">
          بالتسجيل، أنت توافق على{" "}
          <a href="/terms">شروط الاستخدام</a>
          {" "}
          و{" "}
          <a href="/privacy">سياسة الخصوصية</a>
        </p>
      </div>
    </div>
  )
}