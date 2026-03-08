import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { usePlaylistVideos } from "../hooks/usePlaylistVideos"
import { PLAYLIST_COURSES, getSingleCourseProgress } from "../data/courses"
import "./CoursesPage.css"

// ── Sparkles ─────────────────────────────────────────
function Sparkles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animId
    const COLORS = ["#c2b098", "#d4c4ae", "#e8ddd0", "#f0ebe5", "#b09070", "#fff8f0"]
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    resize()
    window.addEventListener("resize", resize)
    class Particle {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x = Math.random() * canvas.width
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10
        this.size = Math.random() * 3 + 1
        this.speedY = -(Math.random() * 0.6 + 0.2)
        this.speedX = (Math.random() - 0.5) * 0.4
        this.opacity = Math.random() * 0.7 + 0.2
        this.twinkleSpeed = Math.random() * 0.03 + 0.01
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
        this.angle = Math.random() * Math.PI * 2
        this.rotSpeed = (Math.random() - 0.5) * 0.05
        this.type = Math.random() > 0.6 ? "star" : "dot"
      }
      drawStar(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle)
        ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color
        ctx.beginPath()
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2
          ctx.lineTo(Math.cos(a) * this.size, Math.sin(a) * this.size)
          ctx.lineTo(Math.cos(a + Math.PI/4) * this.size * 0.4, Math.sin(a + Math.PI/4) * this.size * 0.4)
        }
        ctx.closePath(); ctx.fill(); ctx.restore()
      }
      update() {
        this.y += this.speedY; this.x += this.speedX
        this.opacity += this.twinkleSpeed * this.twinkleDir
        this.angle += this.rotSpeed
        if (this.opacity > 0.9 || this.opacity < 0.1) this.twinkleDir *= -1
        if (this.y < -10) this.reset()
      }
      draw() {
        if (this.type === "star") { this.drawStar(ctx) } else {
          ctx.save(); ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color
          ctx.shadowColor = this.color; ctx.shadowBlur = this.size * 3
          ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill(); ctx.restore()
        }
      }
    }
    const particles = Array.from({ length: 120 }, () => new Particle())
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={canvasRef} className="t-sparkle-canvas" />
}

// ── Navbar ───────────────────────────────────────────
function Navbar({ activePage }) {
  const navigate = useNavigate()
  const { user, login, logout } = useAuth()
  const [dropOpen, setDropOpen] = useState(false)

  useEffect(() => {
    if (!dropOpen) return
    const handler = () => setDropOpen(false)
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [dropOpen])

  return (
    <div className="t-navbar-outer">
      <nav className="t-navbar">
        <div className="t-logo" onClick={() => navigate("/")}>
          <img src="/images/-favicon-color.png" alt="logo" width="50"
            onError={e => { e.target.style.display = "none" }} />
          تدبر
        </div>
        <ul className="t-nav-links">
          <li><a href="#" className={activePage === "home" ? "active" : ""} onClick={e => { e.preventDefault(); navigate("/") }}>الصفحة الرئيسية</a></li>
          <li><a href="#" className={activePage === "courses" ? "active" : ""} onClick={e => { e.preventDefault(); navigate("/courses") }}>الدورات</a></li>
          <li><a href="#" className={activePage === "mafateeh" ? "active" : ""} onClick={e => { e.preventDefault(); navigate("/mafateeh") }}>مفاتيح التدبر</a></li>
          <li><a href="#" className={activePage === "full-quran" ? "active" : ""} onClick={e => { e.preventDefault(); navigate("/full-quran") }}>تدبر القرآن كاملاً</a></li>
        </ul>
        <div className="t-nav-auth">
          {user ? (
            <div className="t-avatar-wrap" onClick={e => { e.stopPropagation(); setDropOpen(o => !o) }}>
              <img src={user.photoURL} alt={user.displayName} className="t-avatar" />
              {dropOpen && (
                <div className="t-dropdown" onClick={e => e.stopPropagation()}>
                  <div className="t-dropdown-user">
                    <img src={user.photoURL} alt="" className="t-dropdown-avatar" />
                    <div>
                      <div className="t-dropdown-name">{user.displayName}</div>
                      <div className="t-dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <hr className="t-dropdown-hr" />
                  <button className="t-dropdown-item" onClick={() => { setDropOpen(false); navigate("/profile") }}>
                    <i className="fa-solid fa-user"></i> ملفي الشخصي
                  </button>
                  <button className="t-dropdown-item t-dropdown-logout" onClick={() => { setDropOpen(false); logout() }}>
                    <i className="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="t-btn-main t-pill" onClick={login}>تسجيل دخول</button>
          )}
        </div>
      </nav>
    </div>
  )
}

// ── Footer ───────────────────────────────────────────
function Footer() {
  const navigate = useNavigate()
  const { user, login, logout } = useAuth()
  return (
    <footer className="t-footer">
      <div className="t-container">
        <div className="t-footer-grid">
          <div>
            <div className="t-footer-logo">
              <img src="/images/-favicon-color.png" alt="logo" width="36"
                onError={e => { e.target.style.display = "none" }} />
              <span>تدبر</span>
            </div>
            <p className="t-footer-desc">منصة متكاملة لتدبر القرآن الكريم بسهولة ويسر.</p>
            <ul className="t-footer-links">
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("/") }}>من نحن</a></li>
              <li><a href="#" onClick={e => e.preventDefault()}>عن التفسير</a></li>
            </ul>
          </div>
          <div>
            <div className="t-footer-col-title">المنصة</div>
            <ul className="t-footer-links">
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("/courses") }}>جميع الدورات</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("/mafateeh") }}>مفاتيح التدبر</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("/full-quran") }}>تدبر القرآن</a></li>
            </ul>
          </div>
          <div>
            <div className="t-footer-col-title">حسابك</div>
            <ul className="t-footer-links">
              <li>
                <a href="#" onClick={e => { e.preventDefault(); user ? navigate("/profile") : login() }}>
                  {user ? "ملفي الشخصي" : "تسجيل دخول"}
                </a>
              </li>
              {user && <li><a href="#" onClick={e => { e.preventDefault(); logout() }}>تسجيل الخروج</a></li>}
            </ul>
          </div>
        </div>
        <hr className="t-footer-hr" />
        <div className="t-footer-bottom">
          <p>© 2026 جميع الحقوق محفوظة - منصة تدبر</p>
          <p>تم التصميم بواسطة <strong>روان كمال</strong></p>
        </div>
      </div>
    </footer>
  )
}

// ── Course Card ──────────────────────────────────────
function CourseCard({ course }) {
  const navigate = useNavigate()
  const { videos } = usePlaylistVideos(course.playlistId)
  const [prog, setProg] = useState({ watched: 0, total: 0, percent: 0 })

  useEffect(() => {
    if (!videos.length) return
    setProg(getSingleCourseProgress(course.id, videos.map(v => v.videoId)))
  }, [videos])

  const isNew    = prog.percent === 0
  const isDone   = prog.percent === 100
  const isActive = !isNew && !isDone

  const stripColor = isDone ? "#4caf8a" : isActive ? "#c2b098" : "#e8ddd0"

  // FA icons instead of emojis
  const BadgeIcon = () => {
    if (isDone)   return <><i className="fa-solid fa-circle-check"></i> مكتمل</>
    if (isActive) return <><i className="fa-solid fa-fire"></i> قيد التعلم</>
    return <><i className="fa-solid fa-star"></i> جديد</>
  }

  const badgeClass = isDone ? "cp-badge-done" : isActive ? "cp-badge-active" : "cp-badge-new"
  const btnText    = isNew ? "ابدأ الآن" : isDone ? "مراجعة الدورة" : "تابع من حيث توقفت"
  const btnClass   = isDone ? "cp-btn-done" : isActive ? "cp-btn-active" : ""
  const BtnIcon    = () => {
    if (isDone)   return <i className="fa-solid fa-rotate-right"></i>
    if (isActive) return <i className="fa-solid fa-play"></i>
    return <i className="fa-solid fa-arrow-left"></i>
  }

  return (
    <div className="cp-card" onClick={() => navigate(`/course/${course.id}`)}>
      <div className="cp-card-strip" style={{ background: stripColor }} />
      <div className="cp-card-body">
        <div className="cp-card-top">
          <div className="cp-card-title">{course.title}</div>
          <span className={`cp-badge ${badgeClass}`}><BadgeIcon /></span>
        </div>
        <div className="cp-instructor">
          <i className="fa-solid fa-user-tie cp-instructor-icon"></i>
          {course.instructor}
        </div>
        <p className="cp-desc">{course.description || "دورة متخصصة في التفسير والتدبر القرآني"}</p>
      </div>
      <div className="cp-card-footer">
        <div>
          <div className="cp-progress-row">
            <span><i className="fa-solid fa-book-open"></i> {prog.watched} / {prog.total || videos.length} درس</span>
            <span>{prog.percent}%</span>
          </div>
          <div className="cp-progress-bar">
            <div className="cp-progress-fill" style={{ width: `${prog.percent}%` }} />
          </div>
        </div>
        <button className={`cp-card-btn ${btnClass}`}>
          <BtnIcon /> {btnText}
        </button>
      </div>
    </div>
  )
}

// ── Filters ──────────────────────────────────────────
const FILTERS = [
  { label: "الكل",    icon: "fa-list",         value: "all"    },
  { label: "قيد التعلم",   icon: "fa-fire",          value: "active" },
  { label: "جديد",   icon: "fa-star",          value: "new"    },
  { label: "مكتمل",  icon: "fa-circle-check",  value: "done"   },
]

// ── Main Page ────────────────────────────────────────
export default function CoursesPage() {
  const [filter, setFilter]   = useState("all")
  const [progMap, setProgMap] = useState({})

  useEffect(() => {
    const map = {}
    PLAYLIST_COURSES.forEach(c => {
      const cached = localStorage.getItem(`yt_cache_${c.playlistId}`)
      if (cached) {
        try {
          const videos = JSON.parse(cached)
          map[c.id] = getSingleCourseProgress(c.id, videos.map(v => v.videoId)).percent
        } catch { map[c.id] = 0 }
      } else { map[c.id] = 0 }
    })
    setProgMap(map)
  }, [])

  const filtered = PLAYLIST_COURSES.filter(c => {
    if (filter === "all")    return true
    const p = progMap[c.id] ?? 0
    if (filter === "done")   return p === 100
    if (filter === "active") return p > 0 && p < 100
    if (filter === "new")    return p === 0
    return true
  })

  return (
    <div className="cp-page">
      <Sparkles />
      <Navbar activePage="courses" />

      {/* Hero — sits flush against navbar, no gap */}
      <div className="cp-hero">
        <div className="t-container">
          <div className="cp-hero-inner">
            <h1 className="cp-hero-title">دوراتنا</h1>
            <p className="cp-hero-sub">دورات متنوعة في التفسير والتدبر — كل دورة تحفظ تقدمك تلقائياً</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="cp-main">
        <div className="t-container">
          <div className="cp-toolbar">
            <div className="cp-filters">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  className={`cp-filter-btn ${filter === f.value ? "active" : ""}`}
                  onClick={() => setFilter(f.value)}
                >
                  <i className={`fa-solid ${f.icon}`}></i>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="cp-count">
              <i className="fa-solid fa-layer-group"></i>
              عرض <strong>{filtered.length}</strong> من {PLAYLIST_COURSES.length} دورة
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="cp-empty">
              <i className="fa-solid fa-magnifying-glass cp-empty-icon"></i>
              <p>لا توجد دورات في هذه الفئة حالياً</p>
            </div>
          ) : (
            <div className="cp-grid">
              {filtered.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
