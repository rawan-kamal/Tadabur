import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { usePlaylistVideos } from "../hooks/usePlaylistVideos"
import { 
  INTRO_COURSE,
  PLAYLIST_COURSES, 
  FULL_QURAN_COURSE,
  getSingleCourseProgress,
  getFullQuranProgress
} from "../data/courses"
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
  }, [videos, course.id])

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
  <div className="cp-card" onClick={() => navigate(course.path || `/course/${course.id}`)} role="button" tabIndex={0}>
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

// Special card for Full Quran course (no playlist)
function FullQuranCard({ course }) {
  const navigate = useNavigate()
  const [prog, setProg] = useState({ watched: 0, total: 0, percent: 0 })

  useEffect(() => {
    if (course.surahs) {
      const progress = getFullQuranProgress(course.id, course.surahs)
      setProg(progress || { watched: 0, total: 114, percent: 0 })
    } else {
      setProg({ watched: 0, total: 114, percent: 0 })
    }
  }, [course.id, course.surahs])

  const isNew    = prog.percent === 0
  const isDone   = prog.percent === 100
  const isActive = !isNew && !isDone

  const stripColor = isDone ? "#4caf8a" : isActive ? "#c2b098" : "#e8ddd0"

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
    <div className="cp-card" onClick={() => navigate(course.path)} role="button" tabIndex={0}>
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
        <p className="cp-desc">{course.description}</p>
      </div>
      <div className="cp-card-footer">
        <div>
          <div className="cp-progress-row">
          <span><i className="fa-solid fa-book-open"></i> {prog.doneSurahs} / {prog.totalSurahs} سورة</span>
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
const STATUS_FILTERS = [
  { label: "الكل",    icon: "fa-list",         value: "all"    },
  { label: "قيد التعلم",   icon: "fa-fire",          value: "active" },
  { label: "جديد",   icon: "fa-star",          value: "new"    },
  { label: "مكتمل",  icon: "fa-circle-check",  value: "done"   },
]

// ── Main Page ────────────────────────────────────────
export default function CoursesPage() {
  const [statusFilter, setStatusFilter]   = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [progMap, setProgMap] = useState({})

  // Calculate progress for all courses
  useEffect(() => {
    const map = {}
    
    // Intro course
    const introCached = localStorage.getItem(`yt_cache_${INTRO_COURSE.playlistId}`)
    if (introCached) {
      try {
        const videos = JSON.parse(introCached)
        map[INTRO_COURSE.id] = getSingleCourseProgress(INTRO_COURSE.id, videos.map(v => v.videoId)).percent
      } catch { map[INTRO_COURSE.id] = 0 }
    } else { map[INTRO_COURSE.id] = 0 }

    // Regular courses
    PLAYLIST_COURSES.forEach(c => {
      const cached = localStorage.getItem(`yt_cache_${c.playlistId}`)
      if (cached) {
        try {
          const videos = JSON.parse(cached)
          map[c.id] = getSingleCourseProgress(c.id, videos.map(v => v.videoId)).percent
        } catch { map[c.id] = 0 }
      } else { map[c.id] = 0 }
    })

    // Full Quran course
    if (FULL_QURAN_COURSE.surahs) {
      map[FULL_QURAN_COURSE.id] = getFullQuranProgress(FULL_QURAN_COURSE.id, FULL_QURAN_COURSE.surahs).percent
    }

    setProgMap(map)
  }, [])

  // Get status from progress
  const getStatus = (progress) => {
    if (progress === 0) return "new"
    if (progress === 100) return "done"
    return "active"
  }

  // Organize courses into categories
  const introCourses = [{
    ...INTRO_COURSE,
    path: "/mafateeh",
    instructor: INTRO_COURSE.instructor || "فاضل سليمان",
    category: "intro"
  }]

  const regularCourses = PLAYLIST_COURSES.map(c => ({
    ...c,
    path: `/course/${c.id}`,
    instructor: c.instructor || "فاضل سليمان",
    category: "courses"
  }))

  const fullQuranCourses = [{
    ...FULL_QURAN_COURSE,
    path: "/full-quran",
    instructor: "فاضل سليمان",
    category: "full-quran"
  }]

  // Apply filters
  const filterByStatus = (courses) => {
    if (statusFilter === "all") return courses
    return courses.filter(c => {
      const p = progMap[c.id] ?? 0
      return getStatus(p) === statusFilter
    })
  }

  // Apply category and status filters
  const filteredIntro = (categoryFilter === "all" || categoryFilter === "intro")
    ? filterByStatus(introCourses)
    : []
  
  const filteredRegular = (categoryFilter === "all" || categoryFilter === "courses")
    ? filterByStatus(regularCourses)
    : []
  
  const filteredFullQuran = (categoryFilter === "all" || categoryFilter === "full-quran")
    ? filterByStatus(fullQuranCourses)
    : []

  const totalVisible = filteredIntro.length + filteredRegular.length + filteredFullQuran.length
  const totalCourses = introCourses.length + regularCourses.length + fullQuranCourses.length

  return (
    <div className="cp-page">
      <Sparkles />
      <Navbar activePage="courses" />

      {/* Hero */}
      <div className="cp-hero">
        <div className="t-container">
          <div className="cp-hero-inner">
            <h1 className="cp-hero-title">رحلتك في تدبّر القرآن الكريم</h1>
            <p className="cp-hero-sub">دورات في أجزاء من القرآن الكريم، أو تدبّر القرآن كاملاً — ابدأ من أي مكان</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="cp-main">
        <div className="t-container">
          
          {/* Category Dropdown */}
          <div className="cp-category-dropdown">
            <label htmlFor="category-select" className="cp-dropdown-label">
              <i className="fa-solid fa-layer-group"></i>
              <span>اختر المسار:</span>
            </label>
            <div className="cp-select-wrapper">
              <select
                id="category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="cp-dropdown-select"
              >
                <option value="all">جميع المسارات</option>
                <option value="intro">الدورة التأسيسية</option>
                <option value="courses">دورات متنوعة</option>
                <option value="full-quran">تدبّر القرآن كاملاً</option>
              </select>
              <i className="fa-solid fa-chevron-down cp-select-icon"></i>
            </div>
          </div>

          {/* Status Filter Toolbar */}
          <div className="cp-toolbar">
            <div className="cp-filters">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f.value}
                  className={`cp-filter-btn ${statusFilter === f.value ? "active" : ""}`}
                  onClick={() => setStatusFilter(f.value)}
                >
                  <i className={`fa-solid ${f.icon}`}></i>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="cp-count">
              <i className="fa-solid fa-layer-group"></i>
              عرض <strong>{totalVisible}</strong> من {totalCourses} دورة
            </div>
          </div>

          {/* SECTION 1: Intro Course */}
          {filteredIntro.length > 0 && (
            <div className="cp-section">
              <div className="cp-section-header">
                <div className="cp-section-marker">
                  <div className="cp-section-number">١</div>
                  <div className="cp-section-line"></div>
                </div>
                <div className="cp-section-content">
                  <div className="cp-section-top">
                    <h2 className="cp-section-title">
                      <i className="fa-solid fa-seedling"></i>
                      الدورة التأسيسية
                    </h2>
                    <span className="cp-section-tag cp-tag-beginner">للمبتدئين</span>
                  </div>
                  <p className="cp-section-subtitle">ابدأ هنا — مفاتيح أساسية لفهم وتدبر القرآن الكريم</p>
                </div>
              </div>
              <div className="cp-grid">
                {filteredIntro.map(c => <CourseCard key={c.id} course={c} />)}
              </div>
            </div>
          )}

          {/* SECTION 2: Regular Courses */}
          {filteredRegular.length > 0 && (
            <div className="cp-section">
              <div className="cp-section-header">
                <div className="cp-section-marker">
                  <div className="cp-section-number">٢</div>
                  <div className="cp-section-line"></div>
                </div>
                <div className="cp-section-content">
                  <div className="cp-section-top">
                    <h2 className="cp-section-title">
                      <i className="fa-solid fa-book-open"></i>
                       دورات متنوعة
                    </h2>
                    <span className="cp-section-tag cp-tag-all">جميع المستويات</span>
                  </div>
                  <p className="cp-section-subtitle">دورات في تفسير أجزاء وسور محددة من القرآن الكريم</p>
                </div>
              </div>
              <div className="cp-grid">
                {filteredRegular.map(c => <CourseCard key={c.id} course={c} />)}
              </div>
            </div>
          )}

          {/* SECTION 3: Full Quran */}
          {filteredFullQuran.length > 0 && (
            <div className="cp-section">
              <div className="cp-section-header">
                <div className="cp-section-marker">
                  <div className="cp-section-number">٣</div>
                  <div className="cp-section-line"></div>
                </div>
                <div className="cp-section-content">
                  <div className="cp-section-top">
                    <h2 className="cp-section-title">
                      <i className="fa-solid fa-book-quran"></i>
                      تدبّر القرآن كاملاً
                    </h2>
                    <span className="cp-section-tag cp-tag-all">جميع المستويات</span>
                  </div>
                  <p className="cp-section-subtitle">رحلة شاملة في تفسير القرآن الكريم سورةً بسورة — ١١٤ سورة كاملة</p>
                </div>
              </div>
              <div className="cp-grid">
                {filteredFullQuran.map(c => <FullQuranCard key={c.id} course={c} />)}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalVisible === 0 && (
            <div className="cp-empty">
              <i className="fa-solid fa-magnifying-glass cp-empty-icon"></i>
              <p>لا توجد دورات في هذه الفئة حالياً</p>
              <button 
                className="cp-empty-btn"
                onClick={() => {
                  setStatusFilter("all")
                  setCategoryFilter("all")
                }}
              >
                <i className="fa-solid fa-rotate-left"></i>
                عرض جميع الدورات
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}