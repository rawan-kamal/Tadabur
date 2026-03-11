import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePlaylistVideos } from "../hooks/usePlaylistVideos"
import {
  INTRO_COURSE,
  PLAYLIST_COURSES,
  isVideoWatched_Single,
  markVideoWatched_Single,
  getSingleCourseProgress,
  initializeCourseVideos
} from "../data/courses"
import { extractSurahFromTitle, extractJuzFromTitle } from "../lib/surahMap"
import LoginNudgeBanner from "../components/LoginNudgeBanner"
import "./PlayerPage.css"

function cleanTitle(title, cleanupWords = []) {
  let t = title
  cleanupWords.forEach(w => { t = t.replace(w, "") })
  return t.replace(/\|/g, "").replace(/\s+/g, " ").trim()
}

export default function PlayerPage() {
  const { courseId, videoId } = useParams()
  const navigate = useNavigate()

  const course   = courseId ? PLAYLIST_COURSES.find(c => c.id === courseId) : INTRO_COURSE
  const basePath = courseId ? `course/${courseId}` : "mafateeh"
  const listPath = courseId ? `/course/${courseId}` : "/mafateeh"
  const isMafateeh = !courseId

  const { videos: rawVideos, loading } = usePlaylistVideos(course?.playlistId)

  // Reverse order for playlist-6 only (مجالس القرآن - سورة فاطر)
  const videos = course?.id === "playlist-6" ? [...rawVideos].reverse() : rawVideos

  const [progress, setProgress]         = useState({ watched: 0, total: 0, percent: 0 })
  const [search, setSearch]             = useState("")
  const [toast, setToast]               = useState("")
  const [showComplete, setShowComplete] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [listPanelVisible, setListPanelVisible] = useState(true)

  const currentIndex = videos.findIndex(v => v.videoId === videoId)
  const currentVideo = videos[currentIndex]
  const prevVideo    = videos[currentIndex - 1]
  const nextVideo    = videos[currentIndex + 1]

  const surahNum  = currentVideo ? extractSurahFromTitle(currentVideo.title) : null
  const juzNum    = currentVideo ? extractJuzFromTitle(currentVideo.title)   : null
  const quranUrl  = surahNum ? `https://quran.com/${surahNum}`
                 : juzNum   ? `https://quran.com/juz/${juzNum}`
                 : null
  const showQuran = !!courseId && !!quranUrl

  const refreshProgress = useCallback(() => {
    if (!course || videos.length === 0) return
    initializeCourseVideos(course.id, videos.map(v => v.videoId))  
    setProgress(getSingleCourseProgress(course.id, videos.map(v => v.videoId)))
  }, [videos, course])

  useEffect(() => {
    if (!course) { navigate("/"); return }
    refreshProgress()
    setShowComplete(false)
    setMobileMenuOpen(false) // Close menu on video change
  }, [videoId, videos])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500) }

  const handleMarkWatched = () => {
    if (!currentVideo || isVideoWatched_Single(course.id, videoId)) return
    markVideoWatched_Single(course.id, videoId)
    refreshProgress()
    if (!nextVideo) {
      setShowComplete(true)
    } else {
      showToast("تم تسجيل المشاهدة!")
      setTimeout(() => navigate(`/${basePath}/${nextVideo.videoId}`), 600)
    }
  }

  const isWatched = isVideoWatched_Single(course?.id, videoId)
  const filtered  = videos.filter(v =>
    cleanTitle(v.title, course?.titleCleanup).includes(search)
  )
  const title = (v) => cleanTitle(v.title, course?.titleCleanup)

  if (!course) return null

  if (loading) return (
    <div className="plr-loading-screen">
      <i className="fa-solid fa-spinner fa-spin"></i>
      <p>جاري تحميل الدروس...</p>
    </div>
  )

  return (
    <div className="plr-shell">
      {/* ── BREADCRUMB ── */}
      <div className="plr-bc-bar">
        <div className="plr-bc-inner">
          {/* Mobile Menu Button */}
          <button 
            className="plr-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="قائمة الدروس"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="plr-bc-trail">
            <button className="plr-bc-btn" onClick={() => navigate("/")}>
              <span>الرئيسية</span>
            </button>
            <i className="fa-solid fa-chevron-left plr-bc-sep"></i>

            {isMafateeh ? (
              <button className="plr-bc-btn" onClick={() => navigate("/mafateeh")}>
                <span>مفاتيح التدبر</span>
              </button>
            ) : (
              <>
                <button className="plr-bc-btn" onClick={() => navigate("/courses")}>
                  <span>الدورات</span>
                </button>
                <i className="fa-solid fa-chevron-left plr-bc-sep"></i>
                <button className="plr-bc-btn" onClick={() => navigate(listPath)}>
                  <span>{course.title}</span>
                </button>
              </>
            )}

            <i className="fa-solid fa-chevron-left plr-bc-sep"></i>
            <div className="plr-bc-btn plr-bc-active">
              <span>{currentVideo ? title(currentVideo) : "..."}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── LOGIN NUDGE BANNER ── */}
      <LoginNudgeBanner />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="plr-mobile-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── LAYOUT ── */}
      <div className={`plr-layout ${showQuran ? "plr-layout-3" : "plr-layout-2"} ${!listPanelVisible ? "plr-layout-no-list" : ""}`}>

        {/* LIST */}
        <div className={`plr-list-panel ${mobileMenuOpen ? "plr-list-open" : ""} ${!listPanelVisible ? "plr-list-hidden" : ""}`}>
          <div className="plr-list-header">
            <div className="plr-list-title-row">
              <div className="plr-list-title">{course.title}</div>
              <button 
                className="plr-list-close-btn"
                onClick={() => setListPanelVisible(false)}
                title="إخفاء القائمة"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="plr-list-bar">
              <div className="plr-list-bar-fill" style={{ width: `${progress.percent}%` }} />
            </div>
            <div className="plr-list-meta">
              {progress.watched}/{progress.total} درس • {progress.percent}%
            </div>
          </div>

          <div className="plr-list-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="ابحث عن درس..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="plr-lessons">
            {filtered.map(video => {
              const watched   = isVideoWatched_Single(course.id, video.videoId)
              const isActive  = video.videoId === videoId
              const realIndex = videos.findIndex(v => v.videoId === video.videoId)
              return (
                <div
                  key={video.videoId}
                  className={`plr-lesson ${isActive ? "plr-active" : ""} ${watched ? "plr-watched" : ""}`}
                  onClick={() => {
                    navigate(`/${basePath}/${video.videoId}`)
                    setMobileMenuOpen(false)
                  }}
                >
                  <div className="plr-lesson-num">
                    {watched
                      ? <i className="fa-solid fa-check"></i>
                      : isActive
                      ? <i className="fa-solid fa-play" style={{ fontSize: "0.6rem" }}></i>
                      : realIndex + 1
                    }
                  </div>
                  <div className="plr-lesson-name">{title(video)}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* VIDEO */}
        <div className="plr-video-panel">
          <div className="plr-video-header">
            <div className="plr-video-label">
              <i className="fa-solid fa-video"></i>
              الفيديو
              <span className="plr-ep-badge">الدرس {currentIndex + 1} / {videos.length}</span>
            </div>
            <div className="plr-video-title">
              {currentVideo ? title(currentVideo) : ""}
            </div>
          </div>
          <div className="plr-iframe-wrap">
            {currentVideo && (
              <iframe
                key={videoId}
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentVideo.title}
              />
            )}
          </div>
        </div>

        {/* QURAN */}
        {showQuran && (
          <div className="plr-quran-panel">
            <div className="plr-quran-header">
              <div className="plr-quran-label">
                <i className="fa-solid fa-book-quran"></i>
                المصحف الشريف
                {surahNum && <span className="plr-quran-badge">سورة {surahNum}</span>}
                {juzNum && !surahNum && <span className="plr-quran-badge">الجزء {juzNum}</span>}
              </div>
              <span className="plr-quran-ref">
                <i className="fa-solid fa-link"></i> quran.com
              </span>
            </div>
            <div className="plr-quran-wrap">
              <iframe
                key={`quran-${videoId}`}
                src={quranUrl}
                title="Quran.com"
                allow="fullscreen"
              />
            </div>
          </div>
        )}

      </div>

      {/* ── FLOATING REOPEN BUTTON ── */}
      {!listPanelVisible && (
        <button 
          className="plr-reopen-list-btn"
          onClick={() => setListPanelVisible(true)}
          title="إظهار القائمة"
        >
          <i className="fa-solid fa-bars"></i>
          <span>القائمة</span>
        </button>
      )}

      {/* ── BOTTOM BAR ── */}
      <div className="plr-bottombar">
        <button className="plr-nav-btn"
          onClick={() => prevVideo && navigate(`/${basePath}/${prevVideo.videoId}`)}
          disabled={!prevVideo}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>

        <div className="plr-progress-wrap">
          <div className="plr-progress-info">
            <span>{course.title}</span>
            <span>{progress.watched}/{progress.total} درس • {progress.percent}%</span>
          </div>
          <div className="plr-progress-bar">
            <div className="plr-progress-fill" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>

        <button className="plr-nav-btn"
          onClick={() => nextVideo && navigate(`/${basePath}/${nextVideo.videoId}`)}
          disabled={!nextVideo}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        <button
          className={`plr-mark-btn ${isWatched ? "plr-watched" : ""}`}
          onClick={handleMarkWatched}
          disabled={isWatched}
        >
          {isWatched
            ? <><i className="fa-solid fa-circle-check"></i> <span>تمت المشاهدة</span></>
            : <><i className="fa-solid fa-check"></i> <span>تم، الدرس التالي</span></>}
        </button>
      </div>

      {/* ── TOAST ── */}
      <div className={`plr-toast ${toast ? "plr-toast-show" : ""}`}>
        <i className="fa-solid fa-circle-check"></i> {toast}
      </div>

      {/* ── COMPLETE OVERLAY ── */}
      {showComplete && (
        <div className="plr-complete-overlay">
          <div className="plr-complete-card">
            <div className="plr-complete-glow" />
            <div className="plr-complete-icon">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <h3 className="plr-complete-title">أحسنت! أتممت الدورة</h3>
            <p className="plr-complete-sub">{course.title}</p>
            <div className="plr-complete-btns">
              {isMafateeh ? (
                <button className="plr-complete-primary" onClick={() => navigate("/full-quran")}>
                  ابدأ تدبّر القرآن <i className="fa-solid fa-arrow-left"></i>
                </button>
              ) : (
                <button className="plr-complete-primary" onClick={() => navigate("/courses")}>
                  استكشف دورات أخرى <i className="fa-solid fa-arrow-left"></i>
                </button>
              )}
              <button className="plr-complete-secondary" onClick={() => navigate(listPath)}>
                <i className="fa-solid fa-list"></i> العودة للقائمة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}