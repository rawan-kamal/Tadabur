import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"


export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login, logout } = useAuth()
  const [dropOpen, setDropOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropOpen) return
    const handler = () => setDropOpen(false)
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [dropOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const navLinks = [
    { label: "الصفحة الرئيسية", path: "/", key: "/" },
    { label: "من نحن", path: "/aboutus", key: "/aboutus" },
    { label: "عن التفسير", path: "/about", key: "/about" },
    { label: "الدورات", path: "/courses", key: "/courses" },
    { label: "تدبر القران كاملا", path: "/full-quran", key: "/full-quran" },
  ]

  return (
    <>
      <div className="h-navbar-outer">
        <div className="h-container">
          <nav className="h-navbar">
            <div className="h-logo" onClick={() => navigate("/")}>
              <img src="/logo.png" alt="logo" width="60"
                onError={e => { e.target.style.display = "none" }} />
              تدبر
            </div>

            {/* Desktop nav links */}
            <ul className="h-nav-links">
              {navLinks.map(link => (
                <li key={link.key}>
                  <a
                    href="#"
                    className={location.pathname === link.key ? "active" : ""}
                    onClick={e => { e.preventDefault(); navigate(link.path) }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="h-nav-auth">
              {user ? (
                <div className="h-avatar-wrap" onClick={e => { e.stopPropagation(); setDropOpen(o => !o) }}>
                  {/* FIX: referrerPolicy="no-referrer" required for Google profile images */}
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="h-avatar"
                    referrerPolicy="no-referrer"
                    onError={e => { e.target.style.display = "none" }}
                  />
                  {dropOpen && (
                    <div className="h-dropdown" onClick={e => e.stopPropagation()}>
                      <div className="h-dropdown-user">
                        {/* FIX: referrerPolicy="no-referrer" required for Google profile images */}
                        <img
                          src={user.photoURL}
                          alt=""
                          className="h-dropdown-avatar"
                          referrerPolicy="no-referrer"
                          onError={e => { e.target.style.display = "none" }}
                        />
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
                <button className="h-btn-main h-rounded-pill h-no-shadow h-login-desktop" onClick={login}>تسجيل دخول</button>
              )}

              {/* Hamburger button — mobile only */}
              <button
                className="h-hamburger"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="القائمة"
              >
                <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"}`}></i>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="h-mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`h-mobile-drawer ${mobileOpen ? "h-mobile-open" : ""}`}>
        <div className="h-mobile-drawer-header">
          <div className="h-logo" onClick={() => { navigate("/"); setMobileOpen(false) }}>
            <img src="/logo.png" alt="logo" width="40"
              onError={e => { e.target.style.display = "none" }} />
            تدبر
          </div>
          <button className="h-mobile-close" onClick={() => setMobileOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {user && (
          <div className="h-mobile-user" onClick={() => { navigate("/profile"); setMobileOpen(false) }}>
            {/* FIX: referrerPolicy="no-referrer" required for Google profile images */}
            <img
              src={user.photoURL}
              alt=""
              className="h-mobile-user-avatar"
              referrerPolicy="no-referrer"
              onError={e => { e.target.style.display = "none" }}
            />
            <div>
              <div className="h-mobile-user-name">{user.displayName}</div>
              <div className="h-mobile-user-email">{user.email}</div>
            </div>
          </div>
        )}

        <nav className="h-mobile-nav">
          {navLinks.map(link => (
            <a
              key={link.key}
              href="#"
              className={`h-mobile-nav-link ${location.pathname === link.key ? "h-mobile-active" : ""}`}
              onClick={e => { e.preventDefault(); navigate(link.path); setMobileOpen(false) }}
            >
              {link.label}
              {location.pathname === link.key && <i className="fa-solid fa-circle" style={{ fontSize: "0.35rem" }}></i>}
            </a>
          ))}
        </nav>

        <div className="h-mobile-footer">
          {user ? (
            <>
              <button className="h-mobile-action-btn" onClick={() => { navigate("/profile"); setMobileOpen(false) }}>
                <i className="fa-solid fa-user"></i> ملفي الشخصي
              </button>
              <button className="h-mobile-logout-btn" onClick={() => { logout(); setMobileOpen(false) }}>
                <i className="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
              </button>
            </>
          ) : (
            <button className="h-mobile-login-btn" onClick={() => { login(); setMobileOpen(false) }}>
              <i className="fa-solid fa-right-to-bracket"></i> تسجيل دخول
            </button>
          )}
        </div>
      </div>
    </>
  )
}