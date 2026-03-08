import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { usePlaylistVideos } from "../hooks/usePlaylistVideos"
import { PLAYLIST_COURSES, getSingleCourseProgress } from "../data/courses"
import "./CoursesPage.css"
import Sparkles from "../components/Sparkles"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"


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

      {/* Hero */}
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