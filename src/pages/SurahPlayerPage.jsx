import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePlaylistVideos } from "../hooks/usePlaylistVideos"
import {
  FULL_QURAN_COURSE,
  FULL_QURAN_SURAHS,
  isEpisodeWatched,
  markEpisodeWatched,
  markSurahDone,
  getSurahProgress,
} from "../data/courses"
import { filterCourseVideos } from "../lib/videoFilter"
import "./SurahPlayerPage.css"

const COURSE_ID = FULL_QURAN_COURSE.id

function extractPlaylistId(url) {
  const match = url.match(/list=([^&]+)/)
  return match ? match[1] : null
}

function extractAyahs(title) {
  if (!title) return null
  const toWestern = (str) =>
    parseInt(str.replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 0x0660), 10)
  const regex = /(?:ال)?[آا]ي[هةاتن]*[:\s]*([\u0660-\u0669\d]+)(?:\s*[-–—]\s*([\u0660-\u0669\d]+))?/
  const match = title.match(regex)
  if (!match) return null
  const start = toWestern(match[1])
  const end = match[2] ? toWestern(match[2]) : null
  if (isNaN(start)) return null
  return { start, end }
}

function extractSingleVideoId(url) {
  const match = url.match(/embed\/(?!videoseries)([^?&/]+)/)
  return match ? match[1] : null
}

export default function SurahPlayerPage() {
  const { surahNumber } = useParams()
  const navigate = useNavigate()
  const num = parseInt(surahNumber)

  const surah         = FULL_QURAN_SURAHS.find(s => s.number === num)
  const playlistId    = surah ? extractPlaylistId(surah.playlistUrl)    : null
  const singleVideoId = surah ? extractSingleVideoId(surah.playlistUrl) : null

  const { videos: rawVideos, loading } = usePlaylistVideos(playlistId)

  // Filter and deduplicate videos for Full Quran
  const videos = useMemo(() => {
    if (!rawVideos.length) return []
    const filtered = filterCourseVideos(rawVideos, 'full-quran')
    return Array.from(new Map(filtered.map(v => [v.videoId, v])).values())
  }, [rawVideos])

  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [watchedMap, setWatchedMap]         = useState({})
  const [progress, setProgress]             = useState({ watched: 0, total: 0, percent: 0 })
  const [drawerOpen, setDrawerOpen]         = useState(false)
  const [toast, setToast]                   = useState("")
  const [showComplete, setShowComplete]     = useState(false)

  const refreshProgress = useCallback(() => {
    if (!surah) return
    const map = {}
    for (let i = 1; i <= surah.videoCount; i++) {
      map[i] = isEpisodeWatched(COURSE_ID, num, i)
    }
    setWatchedMap(map)
    setProgress(getSurahProgress(COURSE_ID, num, surah.videoCount))
  }, [num, surah])

  useEffect(() => {
    if (!surah) { navigate("/full-quran"); return }
    refreshProgress()
    const firstUnwatched = Array.from({ length: surah.videoCount }, (_, i) => i + 1)
      .find(i => !isEpisodeWatched(COURSE_ID, num, i)) || 1
    setCurrentEpisode(firstUnwatched)
    setShowComplete(false)
  }, [num])

  if (!surah) return null

  const videoUrl = (() => {
    if (!playlistId && singleVideoId) return `https://www.youtube.com/embed/${singleVideoId}`
    if (videos.length > 0) {
      const video = videos[currentEpisode - 1]
      if (video) return `https://www.youtube.com/embed/${video.videoId}`
    }
    return surah.playlistUrl
  })()

  const currentVideoTitle = videos[currentEpisode - 1]?.title || ""
  const ayahs = extractAyahs(currentVideoTitle)
  const quranUrl = ayahs?.end
    ? `https://quran.com/${num}/${ayahs.start}-${ayahs.end}`
    : ayahs?.start
    ? `https://quran.com/${num}/${ayahs.start}`
    : `https://quran.com/${num}`

  const episodes  = Array.from({ length: surah.videoCount }, (_, i) => i + 1)
  const prevSurah = FULL_QURAN_SURAHS.find(s => s.number === num - 1)
  const nextSurah = FULL_QURAN_SURAHS.find(s => s.number === num + 1)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500) }

  const handleMarkWatched = () => {
    if (watchedMap[currentEpisode]) return
    markEpisodeWatched(COURSE_ID, num, currentEpisode)
    refreshProgress()
    const newWatched = progress.watched + 1
    if (newWatched >= surah.videoCount) {
      markSurahDone(COURSE_ID, num)
      setShowComplete(true)
    } else {
      showToast("تم تسجيل المشاهدة!")
      setTimeout(() => setCurrentEpisode(prev => Math.min(prev + 1, surah.videoCount)), 600)
    }
  }

  return (
    <div className="sp-shell">

      {/* ── BREADCRUMB ── */}
      <div className="sp-breadcrumb-bar">
        <div className="sp-breadcrumb-inner">
          <div className="sp-breadcrumb-trail">
            <button className="sp-bc-item" onClick={() => navigate("/")}>
              <i className="fa-solid fa-house"></i>
              <span>الرئيسية</span>
            </button>
            <i className="fa-solid fa-chevron-left sp-bc-sep"></i>
            <button className="sp-bc-item" onClick={() => navigate("/full-quran")}>
              <i className="fa-solid fa-book-quran"></i>
              <span>تدبّر القرآن كاملاً</span>
            </button>
            <i className="fa-solid fa-chevron-left sp-bc-sep"></i>
            <div className="sp-bc-item sp-bc-active">
              <i className="fa-solid fa-star-and-crescent"></i>
              <span>{surah.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="sp-layout">

        {/* Video Panel */}
        <div className="sp-video-panel">
          <div className="sp-video-header">
            <div className="sp-video-label">
              <i className="fa-solid fa-video"></i> الفيديو
              <span className="sp-ep-badge">الحلقة {currentEpisode} / {surah.videoCount}</span>
            </div>
            <div className="sp-episode-title">
              {currentVideoTitle || `${surah.name} — الحلقة ${currentEpisode} من ${surah.videoCount}`}
            </div>
          </div>
          <div className="sp-iframe-wrap">
            {loading && playlistId ? (
              <div className="sp-loading-state">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <p>جاري تحميل الحلقات...</p>
              </div>
            ) : (
              <iframe
                key={`${num}-${currentEpisode}-${videoUrl}`}
                src={videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={surah.name}
              />
            )}
          </div>
        </div>

        {/* Quran Panel */}
        <div className="sp-quran-panel">
          <div className="sp-quran-header">
            <div className="sp-quran-label">
              <i className="fa-solid fa-book-quran"></i> المصحف الشريف
            </div>
            <span className="sp-quran-ref">
              <i className="fa-solid fa-link"></i> quran.com/{num}
            </span>
          </div>
          <div className="sp-quran-wrap">
            <iframe
              key={`quran-${num}-${currentEpisode}`}
              src={quranUrl}
              title="Quran.com"
              allow="fullscreen"
            />
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="sp-bottombar">
        <button className="sp-episodes-toggle" onClick={() => setDrawerOpen(true)}>
          <i className="fa-solid fa-list"></i>
          <span>الحلقات</span>
        </button>

        <button className="sp-nav-btn" title="السورة السابقة"
          onClick={() => prevSurah && navigate(`/full-quran/${prevSurah.number}`)}
          disabled={!prevSurah}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>

        <div className="sp-progress-wrap">
          <div className="sp-progress-info">
            <span>{surah.name}</span>
            <span>{progress.watched}/{progress.total} حلقة • {progress.percent}%</span>
          </div>
          <div className="sp-progress-bar">
            <div className="sp-progress-fill" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>

        <button className="sp-nav-btn" title="السورة التالية"
          onClick={() => nextSurah && navigate(`/full-quran/${nextSurah.number}`)}
          disabled={!nextSurah}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        <button
          className={`sp-mark-btn ${watchedMap[currentEpisode] ? "sp-watched" : ""}`}
          onClick={handleMarkWatched}
          disabled={watchedMap[currentEpisode]}
        >
          {watchedMap[currentEpisode]
            ? <><i className="fa-solid fa-circle-check"></i> تمت المشاهدة</>
            : <><i className="fa-solid fa-check"></i> تم، الحلقة التالية</>}
        </button>
      </div>

      {/* ── EPISODES DRAWER ── */}
      {drawerOpen && (
        <>
          <div className="sp-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="sp-drawer">
            <div className="sp-drawer-header">
              <div>
                <div className="sp-drawer-title">{surah.name}</div>
                <div className="sp-drawer-sub">{surah.videoCount} حلقة · {progress.percent}% مكتمل</div>
              </div>
              <button className="sp-drawer-close" onClick={() => setDrawerOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="sp-drawer-progress-bar">
              <div className="sp-drawer-progress-fill" style={{ width: `${progress.percent}%` }} />
            </div>
            <div className="sp-drawer-list">
              {episodes.map(ep => (
                <div
                  key={ep}
                  className={`sp-episode-item ${ep === currentEpisode ? "sp-ep-active" : ""} ${watchedMap[ep] ? "sp-ep-done" : ""}`}
                  onClick={() => { setCurrentEpisode(ep); setDrawerOpen(false) }}
                >
                  <div className="sp-episode-icon">
                    {watchedMap[ep] ? <i className="fa-solid fa-check"></i> : ep}
                  </div>
                  <div className="sp-episode-name">
                    {videos[ep - 1]?.title || `${surah.name} — الحلقة ${ep}`}
                  </div>
                  {ep === currentEpisode && (
                    <i className="fa-solid fa-play sp-ep-playing"></i>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── TOAST ── */}
      <div className={`sp-toast ${toast ? "sp-toast-show" : ""}`}>
        <i className="fa-solid fa-circle-check"></i> {toast}
      </div>

      {/* ── COMPLETE OVERLAY ── */}
      {showComplete && (
        <div className="sp-complete-overlay">
          <div className="sp-complete-card">
            <div className="sp-complete-glow" />
            <div className="sp-complete-icon">
              <i className="fa-solid fa-trophy"></i>
            </div>
            <h3 className="sp-complete-title">أحسنت! أتممت {surah.name}</h3>
            <p className="sp-complete-sub">لقد أكملت جميع حلقات هذه السورة بنجاح</p>
            <div className="sp-complete-btns">
              {nextSurah && (
                <button className="sp-complete-primary"
                  onClick={() => { setShowComplete(false); navigate(`/full-quran/${nextSurah.number}`) }}>
                  التالية: {nextSurah.name} <i className="fa-solid fa-arrow-left"></i>
                </button>
              )}
              <button className="sp-complete-secondary" onClick={() => navigate("/full-quran")}>
                <i className="fa-solid fa-list"></i> العودة للقائمة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}