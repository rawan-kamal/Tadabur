import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FULL_QURAN_COURSE, isSurahDone, getFullQuranProgress, getSurahProgress } from "../data/courses"
import "./FullQuranPage.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import CertificateModal from "../components/CertificateModal"

const COURSE_ID = FULL_QURAN_COURSE.id
const SURAHS    = FULL_QURAN_COURSE.surahs
const CIRCUMFERENCE = 2 * Math.PI * 54

export default function FullQuranPage() {
  const navigate = useNavigate()
  const [progress, setProgress]   = useState({ doneSurahs: 0, totalSurahs: 114, percent: 0 })
  const [search, setSearch]       = useState("")
  const [surahsDone, setSurahsDone] = useState({})
  const [surahProgress, setSurahProgress] = useState({}) // NEW: Track progress for each surah
  const [showCertificate, setShowCertificate] = useState(false)

  useEffect(() => {
    const p = getFullQuranProgress(COURSE_ID, SURAHS)
    setProgress(p)
    
    const done = {}
    const progressMap = {} // NEW
    
    SURAHS.forEach(s => {
      done[s.number] = isSurahDone(COURSE_ID, s.number)
      // NEW: Calculate progress for each surah
      const surahProg = getSurahProgress(COURSE_ID, s.number, s.videoCount)
      progressMap[s.number] = surahProg.percent
    })
    
    setSurahsDone(done)
    setSurahProgress(progressMap) // NEW
  }, [])

  const filtered = SURAHS.filter(s => s.name.includes(search))

  const handleNextSurah = () => {
    const next = SURAHS.find(s => !surahsDone[s.number])
    if (next) navigate(`/full-quran/${next.number}`)
  }

  const strokeOffset = CIRCUMFERENCE - (progress.percent / 100) * CIRCUMFERENCE

  return (
    <div className="fq-page-shell">
      <Navbar activePage="full-quran" />

      {/* ── HERO ── */}
      <div className="fq-hero">
        <div className="t-container">
          <div className="fq-hero-inner">
            <h1 className="fq-hero-title">تدبّر القرآن كاملاً</h1>
            <p className="fq-hero-sub">
              رحلة شاملة مع الشيخ فاضل سليمان سورةً بسورة — اختر أي سورة لتبدأ رحلتك معها
            </p>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="fq-body">
        <div className="t-container">
          <div className="fq-layout">

            {/* SIDEBAR */}
            <aside className="fq-sidebar">

              {/* Progress Card */}
              <div className="fq-progress-card">
                <p className="fq-progress-label">تقدّمك في الدورة</p>

                <div className="fq-circle-wrap">
                  <svg className="fq-circle-svg" viewBox="0 0 120 120">
                    <circle className="fq-circle-bg" cx="60" cy="60" r="54" />
                    <circle
                      className="fq-circle-fg"
                      cx="60" cy="60" r="54"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={strokeOffset}
                    />
                  </svg>
                  <div className="fq-circle-text">{progress.percent}%</div>
                </div>

                <div className="fq-stats">
                  <div className="fq-stat">
                    <span className="fq-stat-num">{progress.doneSurahs}</span>
                    <span className="fq-stat-label">سورة أتممتها</span>
                  </div>
                  <div className="fq-stat-divider" />
                  <div className="fq-stat">
                    <span className="fq-stat-num">{progress.totalSurahs - progress.doneSurahs}</span>
                    <span className="fq-stat-label">سورة متبقية</span>
                  </div>
                </div>

                <button className="fq-next-btn" onClick={handleNextSurah}>
                  {progress.percent === 0 && <><i className="fa-solid fa-play"></i> ابدأ الآن</>}
                  {progress.percent > 0 && progress.percent < 100 && <><i className="fa-solid fa-rotate-right"></i> تابع من حيث توقفت</>}
                  {progress.percent === 100 && <><i className="fa-solid fa-circle-check"></i> أتممت القرآن كاملاً</>}
                </button>

                {/* Certificate Button */}
                {progress.percent === 100 && (
                  <button 
                    className="fq-certificate-btn"
                    onClick={() => setShowCertificate(true)}
                  >
                    <i className="fa-solid fa-award"></i>
                    احصل على شهادتك
                  </button>
                )}
              </div>

              {/* Info Card */}
              <div className="fq-info-card">
                <h4 className="fq-info-title">
                  <i className="fa-solid fa-play"></i> معلومات الدورة
                </h4>
                {[
                  { label: "الشيخ",             value: "فاضل سليمان" },
                  { label: "عدد السور",          value: "١١٤ سورة" },
                  { label: "إجمالي الفيديوهات", value: `${FULL_QURAN_COURSE.totalVideos}+` },
                  { label: "المسار",             value: "تدبّر القرآن كاملاً" },
                ].map(r => (
                  <div className="fq-info-row" key={r.label}>
                    <span className="fq-info-key">{r.label}</span>
                    <span className="fq-info-val">{r.value}</span>
                  </div>
                ))}
              </div>

            </aside>

            {/* MAIN */}
            <main className="fq-main">

              {/* Search */}
              <div className="fq-search-wrap">
                <i className="fa-solid fa-magnifying-glass fq-search-icon"></i>
                <input
                  className="fq-search-input"
                  type="text"
                  placeholder="ابحث عن سورة..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Count */}
              <p className="fq-count">
                عرض <strong>{filtered.length}</strong> من {SURAHS.length} سورة
              </p>

              {/* Grid */}
              <div className="fq-surah-grid">
                {filtered.map(surah => {
                  const done = surahsDone[surah.number]
                  const percent = surahProgress[surah.number] || 0 // NEW: Get actual progress
                  
                  return (
                    <div key={surah.number} className={`fq-surah-card ${done ? "fq-done" : ""}`} onClick={() => navigate(`/full-quran/${surah.number}`)} role="button" tabIndex={0}>
                      <div className={`fq-surah-num ${done ? "fq-num-done" : ""}`}>
                        {done ? <i className="fa-solid fa-check"></i> : surah.number}
                      </div>
                      <div className="fq-surah-info">
                        <div className="fq-surah-name">{surah.name}</div>
                        <div className="fq-surah-meta">
                          <i className="fa-solid fa-video"></i> {surah.videoCount} فيديو
                        </div>
                        <div className="fq-mini-bar">
                          <div className="fq-mini-fill" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                      <div className="fq-surah-arrow">
                        <i className={`fa-solid ${done ? "fa-circle-check" : "fa-arrow-left"}`}></i>
                      </div>
                    </div>
                  )
                })}
              </div>

            </main>
          </div>
        </div>
      </div>

      <Footer />

      {/* Certificate Modal */}
      <CertificateModal 
        isOpen={showCertificate} 
        onClose={() => setShowCertificate(false)} 
      />
    </div>
  )
}