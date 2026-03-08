import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"


export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login, logout } = useAuth()
  const [dropOpen, setDropOpen] = useState(false)

  return (
    <div className="h-navbar-outer">
      <div className="h-container">
        <nav className="h-navbar">
          <div className="h-logo" onClick={() => navigate("/")}>
            <img src="./logo.png" alt="logo" width="60"
              onError={e => { e.target.style.display = "none" }} />
            تدبر
          </div>

          <ul className="h-nav-links">
            <li><a href="#" className={location.pathname === "/" ? "active" : ""} onClick={e => { e.preventDefault(); navigate("/") }}>الصفحة الرئيسية</a></li>
            <li><a href="#" className={location.pathname === "/aboutus" ? "active" : ""} onClick={e => { e.preventDefault(); navigate("/aboutus") }}>من نحن</a></li>
            <li><a href="#" className={location.pathname === "/about" ? "active" : ""} onClick={e => { e.preventDefault(); navigate("/about") }}>عن التفسير</a></li>
            <li><a href="#" className={location.pathname === "/courses" ? "active" : ""} onClick={e => { e.preventDefault(); navigate("/courses") }}>الدورات</a></li>
            <li><a href="#" className={location.pathname === "/full-quran" ? "active" : ""} onClick={e => { e.preventDefault(); navigate("/full-quran") }}>تدبر القران كاملا</a></li>
          </ul>

          <div className="h-nav-auth">
            {user ? (
              <div className="h-avatar-wrap" onClick={e => { e.stopPropagation(); setDropOpen(o => !o) }}>
                <img src={user.photoURL} alt={user.displayName} className="h-avatar" />
                {dropOpen && (
                  <div className="h-dropdown" onClick={e => e.stopPropagation()}>
                    <div className="h-dropdown-user">
                      <img src={user.photoURL} alt="" className="h-dropdown-avatar" />
                      <div>
                        <div className="h-dropdown-name">{user.displayName}</div>
                        <div className="h-dropdown-email">{user.email}</div>
                      </div>
                    </div>
                    <hr className="h-dropdown-hr" />
                    <button className="h-dropdown-item" onClick={() => { setDropOpen(false); navigate("/profile") }}>
                      <i className="fa-solid fa-user"></i> ملفي الشخصي
                    </button>
                    <button className="h-dropdown-item h-dropdown-logout" onClick={() => { setDropOpen(false); logout() }}>
                      <i className="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="h-btn-main h-rounded-pill h-no-shadow" onClick={login}>تسجيل دخول</button>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}