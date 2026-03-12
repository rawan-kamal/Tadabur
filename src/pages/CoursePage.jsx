import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { usePlaylistVideos } from "../hooks/usePlaylistVideos"
import {
  INTRO_COURSE,
  PLAYLIST_COURSES,
  isVideoWatched_Single,
  getSingleCourseProgress,
  initializeCourseVideos
} from "../data/courses"
import { extractSurahFromTitle } from "../lib/surahMap"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./CoursePage.css"

const CIRCUMFERENCE = 2 * Math.PI * 54

function cleanTitle(title, cleanupWords = []) {
  let t = title
  cleanupWords.forEach(w => { t = t.replace(w, "") })
  return t.replace(/\|/g, "").replace(/\s+/g, " ").trim()
}

export default function CoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const course = courseId ? PLAYLIST_COURSES.find(c => c.id === courseId) : INTRO_COURSE
  const basePath = courseId ? `course/${courseId}` : "mafateeh"

  const { videos, loading } = usePlaylistVideos(course?.playlistId)
  const [progress, setProgress] = useState({ watched: 0, total: 0, percent: 0 })
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!course) { navigate("/"); return }
    initializeCourseVideos(course.id, videos.map(v => v.videoId))  
    if (videos.length === 0) return
    setProgress(getSingleCourseProgress(course.id, videos.map(v => v.videoId)))
  }, [videos, course])

  if (!course) return null

  const handleStart = () => {
    const next = videos.find(v => !isVideoWatched_Single(course.id, v.videoId))
    const target = next || videos[0]
    if (target) navigate(`/${basePath}/${target.videoId}`)
  }

  const strokeOffset = CIRCUMFERENCE - (progress.percent / 100) * CIRCUMFERENCE

  const filtered = videos.filter(v =>
    cleanTitle(v.title, course.titleCleanup).includes(search)
  )

  return (
    <div className="cov-shell">
      <Navbar />

      {/* ── HERO ── */}
      <div className="cov-hero">
        <div className="t-container">
          <div className="cov-hero-inner">
            <h1 className="cov-hero-title">{course.title}</h1>
            <p className="cov-hero-sub">
              {course.description || "دورة متخصصة في التفسير والتدبر القرآني"}
            </p>
          </div>
        </div>
      </div>

      {/* ── BREADCRUMB ── */}
      <div className="cov-bc-bar">
        <div className="t-container">
          <div className="cov-bc-trail">
            <button className="cov-bc-item" onClick={() => navigate("/")}>
              <i className="fa-solid fa-house"></i>
              <span>الرئيسية</span>
            </button>
            <i className="fa-solid fa-chevron-left cov-bc-sep"></i>
            <button className="cov-bc-item" onClick={() => navigate("/courses")}>
              <i className="fa-solid fa-graduation-cap"></i>
              <span>الدورات</span>
            </button>
            <i className="fa-solid fa-chevron-left cov-bc-sep"></i>
            <div className="cov-bc-item cov-bc-active">
              <i className="fa-solid fa-book-open"></i>
              <span>{course.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="cov-body">
        <div className="t-container">
          <div className="sc-layout">

            {/* Sidebar */}
            <aside className="sc-sidebar">

              <div className="sc-progress-card">
                <p className="sc-progress-label">تقدّمك في الدورة</p>
                <div className="sc-circle-wrap">
                  <svg className="sc-circle-svg" viewBox="0 0 120 120">
                    <circle className="sc-circle-bg" cx="60" cy="60" r="54" />
                    <circle
                      className="sc-circle-fg"
                      cx="60" cy="60" r="54"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={strokeOffset}
                    />
                  </svg>
                  <div className="sc-circle-text">{progress.percent}%</div>
                </div>
                <div className="sc-stats">
                  <div className="sc-stat">
                    <span className="sc-stat-num">{progress.watched}</span>
                    <span className="sc-stat-label">درس أتممته</span>
                  </div>
                  <div className="sc-stat-divider" />
                  <div className="sc-stat">
                    <span className="sc-stat-num">{progress.total - progress.watched}</span>
                    <span className="sc-stat-label">درس متبقي</span>
                  </div>
                </div>
                <button className="sc-start-btn" onClick={handleStart}>
                  {progress.percent === 0 && <><i className="fa-solid fa-play"></i> ابدأ الآن</>}
                  {progress.percent > 0 && progress.percent < 100 && <><i className="fa-solid fa-rotate-right"></i> تابع من حيث توقفت</>}
                  {progress.percent === 100 && <><i className="fa-solid fa-circle-check"></i> أتممت الدورة</>}
                </button>
              </div>

              <div className="sc-info-card">
                <h4 className="sc-info-title">
                  <i className="fa-solid fa-book-quran"></i> معلومات الدورة
                </h4>
                {[
                  { label: "الشيخ",      value: course.instructor || "فاضل سليمان" },
                  { label: "عدد الدروس", value: `${videos.length} درس` },
                  { label: "المسار",     value: course.title },
                  // { label: "المستوى",    value: courseId ? "متوسط" : "مبتدئ" },
                ].map(r => (
                  <div className="sc-info-row" key={r.label}>
                    <span className="sc-info-key">{r.label}</span>
                    <span className="sc-info-val">{r.value}</span>
                  </div>
                ))}
              </div>

            </aside>

            {/* Main */}
            <main className="cov-main">

              <div className="sc-search-wrap">
                <i className="fa-solid fa-magnifying-glass sc-search-icon"></i>
                <input
                  className="sc-search-input"
                  type="text"
                  placeholder="ابحث عن درس..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <p className="cov-count">
                عرض <strong>{filtered.length}</strong> من {videos.length} درس
              </p>

              {loading ? (
                <div className="sc-loading">
                  <i className="fa-solid fa-spinner fa-spin sc-loading-icon"></i>
                  <p>جاري تحميل الدروس...</p>
                </div>
              ) : (
                <div className="cov-lessons">
                  {filtered.map((video) => {
                    const watched  = isVideoWatched_Single(course.id, video.videoId)
                    const title    = cleanTitle(video.title, course.titleCleanup)
                    const realIdx  = videos.findIndex(v => v.videoId === video.videoId)
                    const surahNum = extractSurahFromTitle(video.title)
                    return (
                      <div
                        key={video.videoId}
                        className={`cov-lesson ${watched ? "cov-watched" : ""}`}
                        onClick={() => navigate(`/${basePath}/${video.videoId}`)}
                      >
                        <div className={`cov-lesson-num ${watched ? "cov-num-done" : ""}`}>
                          {watched ? <i className="fa-solid fa-check"></i> : realIdx + 1}
                        </div>
                        <div className="cov-lesson-info">
                          <div className="cov-lesson-title">{title}</div>
                          <div className="cov-lesson-sub">
                            <span>الدرس {realIdx + 1} من {videos.length}</span>
                          </div>
                        </div>
                        <div className="cov-lesson-arrow">
                          <i className={`fa-solid ${watched ? "fa-circle-check" : "fa-arrow-left"}`}></i>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </main>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}