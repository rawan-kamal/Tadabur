import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { deleteUserAccount } from "../lib/progressService"
import {
  PLAYLIST_COURSES,
  INTRO_COURSE,
  FULL_QURAN_COURSE,
  FULL_QURAN_SURAHS,
  getSingleCourseProgress,
  getFullQuranProgress,
  isSurahDone,
} from "../data/courses"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Sparkles from "../components/Sparkles"
import "./ProfilePage.css"

function getOverallStats() {
  let totalWatched = 0
  let totalLessons = 0
  const courseProgress = []

  // Mafateeh
  const mafCached = localStorage.getItem(`yt_cache_${INTRO_COURSE.playlistId}`)
  if (mafCached) {
    try {
      const vids = JSON.parse(mafCached)
      const p = getSingleCourseProgress(INTRO_COURSE.id, vids.map(v => v.videoId))
      totalWatched += p.watched
      totalLessons += p.total
      courseProgress.push({ ...INTRO_COURSE, ...p, route: "/mafateeh" })
    } catch { /* skip */ }
  }

  // Playlist courses
  PLAYLIST_COURSES.forEach(c => {
    const cached = localStorage.getItem(`yt_cache_${c.playlistId}`)
    if (cached) {
      try {
        const vids = JSON.parse(cached)
        const p = getSingleCourseProgress(c.id, vids.map(v => v.videoId))
        totalWatched += p.watched
        totalLessons += p.total
        courseProgress.push({ ...c, ...p, route: `/course/${c.id}` })
      } catch { /* skip */ }
    }
  })

  // Full Quran
  const fqProgress = getFullQuranProgress(FULL_QURAN_COURSE.id, FULL_QURAN_SURAHS)
  const doneSurahs = FULL_QURAN_SURAHS.filter(s => isSurahDone(FULL_QURAN_COURSE.id, s.number)).length

  return {
    totalWatched,
    totalLessons,
    doneSurahs,
    totalSurahs: 114,
    courseProgress,
    fqPercent: fqProgress.percent,
    totalCourses: courseProgress.length + 1,
    completedCourses: courseProgress.filter(c => c.percent === 100).length + (fqProgress.percent === 100 ? 1 : 0),
  }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    setLoading(true)
    // Small delay to ensure smooth render
    setTimeout(() => {
      setStats(getOverallStats())
      setLoading(false)
    }, 100)
  }, [])

  if (!user) {
    navigate("/")
    return null
  }

  // Loading state
  if (loading) {
    return (
      <div className="pr-page">
        <Sparkles />
        <Navbar />
        <div className="pr-loading">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>جاري تحميل بياناتك...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!stats) return null

  const achievements = [
    {
      icon: "fa-seedling",
      name: "أول خطوة",
      desc: "شاهد أول درس",
      unlocked: stats.totalWatched >= 1,
      color: "gold",
    },
    {
      icon: "fa-fire",
      name: "متحمّس",
      desc: "أتمم ١٠ دروس",
      unlocked: stats.totalWatched >= 10,
      color: "gold",
    },
    {
      icon: "fa-graduation-cap",
      name: "متعلّم",
      desc: "أتمم دورة كاملة",
      unlocked: stats.completedCourses >= 1,
      color: "green",
    },
    {
      icon: "fa-book-quran",
      name: "تدبّر سورة",
      desc: "أتمم سورة من القرآن",
      unlocked: stats.doneSurahs >= 1,
      color: "green",
    },
    {
      icon: "fa-star",
      name: "نجم",
      desc: "أتمم ٥٠ درساً",
      unlocked: stats.totalWatched >= 50,
      color: "gold",
    },
    {
      icon: "fa-trophy",
      name: "خاتم القرآن",
      desc: "أتمم القرآن كاملاً",
      unlocked: stats.doneSurahs >= 114,
      color: "green",
    },
  ]

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError("")

    try {
      await deleteUserAccount(user.uid)
      // Account deleted successfully - navigate to home
      navigate("/")
    } catch (err) {
      console.error("Delete account error:", err)
      setDeleteError(
        err.code === "auth/requires-recent-login"
          ? "يرجى تسجيل الدخول مرة أخرى قبل حذف حسابك"
          : "حدث خطأ أثناء حذف الحساب. يرجى المحاولة لاحقاً"
      )
      setDeleteLoading(false)
    }
  }

  return (
    <div className="pr-page">
      <Sparkles />
      <Navbar />

      {/* ── HERO ── */}
      <div className="pr-hero">
        <div className="t-container">
          <div className="pr-hero-inner">
            <div className="pr-avatar-wrap">
              <img src={user.photoURL} alt={user.displayName} className="pr-avatar" />
              <div className="pr-avatar-badge">
                <i className="fa-solid fa-check"></i>
              </div>
            </div>
            <div className="pr-hero-info">
              <h1 className="pr-hero-name">{user.displayName}</h1>
              <p className="pr-hero-email">{user.email}</p>
              <span className="pr-hero-joined">
                <i className="fa-solid fa-calendar-check"></i>
                عضو في تدبّر
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="t-container">
        <div className="pr-stats-bar">
          <div className="pr-stat-card">
            <div className="pr-stat-icon">
              <i className="fa-solid fa-play"></i>
            </div>
            <div className="pr-stat-num">{stats.totalWatched}</div>
            <div className="pr-stat-label">درس أتممته</div>
          </div>
          <div className="pr-stat-card">
            <div className="pr-stat-icon">
              <i className="fa-solid fa-book-open"></i>
            </div>
            <div className="pr-stat-num">{stats.doneSurahs}</div>
            <div className="pr-stat-label">سورة مكتملة</div>
          </div>
          <div className="pr-stat-card">
            <div className="pr-stat-icon">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div className="pr-stat-num">{stats.completedCourses}</div>
            <div className="pr-stat-label">دورة مكتملة</div>
          </div>
          <div className="pr-stat-card">
            <div className="pr-stat-icon">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div className="pr-stat-num">{stats.fqPercent}%</div>
            <div className="pr-stat-label">تقدم القرآن كاملاً</div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="pr-body">
        <div className="t-container">
          <div className="pr-grid">

            {/* COURSE PROGRESS */}
            <div className="pr-section-card pr-section-full">
              <div className="pr-section-header">
                <h3 className="pr-section-title">
                  <i className="fa-solid fa-chart-pie"></i> تقدمك في الدورات
                </h3>
              </div>
              <div className="pr-section-body">
                {stats.courseProgress.length === 0 ? (
                  <div className="pr-empty">
                    <i className="fa-solid fa-book-open"></i>
                    <p>لم تبدأ أي دورة بعد</p>
                    <button className="pr-empty-btn" onClick={() => navigate("/courses")}>
                      استكشف الدورات <i className="fa-solid fa-arrow-left"></i>
                    </button>
                  </div>
                ) : (
                  <div className="pr-course-list">
                    {/* Full Quran */}
                    <div
                      className="pr-course-item"
                      onClick={() => navigate("/full-quran")}
                    >
                      <div className={`pr-course-icon ${stats.fqPercent === 100 ? "pr-course-icon-done" : stats.fqPercent > 0 ? "pr-course-icon-active" : "pr-course-icon-new"}`}>
                        <i className={`fa-solid ${stats.fqPercent === 100 ? "fa-circle-check" : "fa-book-quran"}`}></i>
                      </div>
                      <div className="pr-course-info">
                        <div className="pr-course-name">تدبّر القرآن كاملاً</div>
                        <div className="pr-course-meta">
                          <span>فاضل سليمان</span>
                          <span>{stats.doneSurahs} / 114 سورة</span>
                        </div>
                      </div>
                      <div className="pr-course-bar">
                        <div
                          className={`pr-course-bar-fill ${stats.fqPercent === 100 ? "pr-course-bar-fill-done" : "pr-course-bar-fill-active"}`}
                          style={{ width: `${stats.fqPercent}%` }}
                        />
                      </div>
                      <div className="pr-course-percent">{stats.fqPercent}%</div>
                      <div className="pr-course-arrow">
                        <i className="fa-solid fa-arrow-left"></i>
                      </div>
                    </div>

                    {/* Other courses */}
                    {stats.courseProgress.map(c => (
                      <div
                        key={c.id}
                        className="pr-course-item"
                        onClick={() => navigate(c.route)}
                      >
                        <div className={`pr-course-icon ${c.percent === 100 ? "pr-course-icon-done" : c.percent > 0 ? "pr-course-icon-active" : "pr-course-icon-new"}`}>
                          <i className={`fa-solid ${c.percent === 100 ? "fa-circle-check" : c.percent > 0 ? "fa-fire" : "fa-star"}`}></i>
                        </div>
                        <div className="pr-course-info">
                          <div className="pr-course-name">{c.title}</div>
                          <div className="pr-course-meta">
                            <span>{c.instructor}</span>
                            <span>{c.watched} / {c.total} درس</span>
                          </div>
                        </div>
                        <div className="pr-course-bar">
                          <div
                            className={`pr-course-bar-fill ${c.percent === 100 ? "pr-course-bar-fill-done" : "pr-course-bar-fill-active"}`}
                            style={{ width: `${c.percent}%` }}
                          />
                        </div>
                        <div className="pr-course-percent">{c.percent}%</div>
                        <div className="pr-course-arrow">
                          <i className="fa-solid fa-arrow-left"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="pr-section-card">
              <div className="pr-section-header">
                <h3 className="pr-section-title">
                  <i className="fa-solid fa-medal"></i> الإنجازات
                </h3>
              </div>
              <div className="pr-section-body">
                <div className="pr-achievements-grid">
                  {achievements.map(a => (
                    <div
                      key={a.name}
                      className={`pr-achievement ${!a.unlocked ? "pr-achievement-locked" : ""}`}
                    >
                      <div className={`pr-achievement-icon ${a.unlocked ? (a.color === "green" ? "pr-achievement-green" : "pr-achievement-gold") : "pr-achievement-silver"}`}>
                        <i className={`fa-solid ${a.icon}`}></i>
                      </div>
                      <div className="pr-achievement-name">{a.name}</div>
                      <div className="pr-achievement-desc">{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="pr-section-card">
              <div className="pr-section-header">
                <h3 className="pr-section-title">
                  <i className="fa-solid fa-bolt"></i> وصول سريع
                </h3>
              </div>
              <div className="pr-section-body">
                <div className="pr-actions-grid">
                  <div className="pr-action-btn" onClick={() => navigate("/courses")}>
                    <div className="pr-action-icon">
                      <i className="fa-solid fa-book"></i>
                    </div>
                    <div className="pr-action-text">
                      <div className="pr-action-title">الدورات</div>
                      <div className="pr-action-desc">استكشف جميع الدورات</div>
                    </div>
                  </div>
                  <div className="pr-action-btn" onClick={() => navigate("/full-quran")}>
                    <div className="pr-action-icon">
                      <i className="fa-solid fa-book-quran"></i>
                    </div>
                    <div className="pr-action-text">
                      <div className="pr-action-title">تدبر القرآن</div>
                      <div className="pr-action-desc">أكمل رحلتك</div>
                    </div>
                  </div>
                  <div className="pr-action-btn" onClick={() => navigate("/mafateeh")}>
                    <div className="pr-action-icon">
                      <i className="fa-solid fa-key"></i>
                    </div>
                    <div className="pr-action-text">
                      <div className="pr-action-title">مفاتيح التدبر</div>
                      <div className="pr-action-desc">تعلّم الأساسيات</div>
                    </div>
                  </div>
                  <div className="pr-action-btn" onClick={() => navigate("/about")}>
                    <div className="pr-action-icon">
                      <i className="fa-solid fa-circle-info"></i>
                    </div>
                    <div className="pr-action-text">
                      <div className="pr-action-title">عن التفسير</div>
                      <div className="pr-action-desc">تعرف على أهمية التفسير</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ACCOUNT ACTIONS */}
          <div className="pr-account-actions">
            <button className="pr-logout-btn" onClick={() => { logout(); navigate("/") }}>
              <i className="fa-solid fa-right-from-bracket"></i>
              تسجيل الخروج
            </button>
            <button className="pr-delete-btn" onClick={() => setShowDeleteDialog(true)}>
              <i className="fa-solid fa-trash-can"></i>
              حذف الحساب
            </button>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      {showDeleteDialog && (
        <>
          <div className="pr-dialog-overlay" onClick={() => !deleteLoading && setShowDeleteDialog(false)} />
          <div className="pr-dialog">
            <div className="pr-dialog-header">
              <div className="pr-dialog-icon pr-dialog-icon-danger">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3 className="pr-dialog-title">تأكيد حذف الحساب</h3>
            </div>
            <div className="pr-dialog-body">
              <p className="pr-dialog-text">
                هل أنت متأكد من حذف حسابك؟ <strong>لا يمكن التراجع عن هذا الإجراء.</strong>
              </p>
              <div className="pr-dialog-warning">
                <i className="fa-solid fa-circle-exclamation"></i>
                <div>
                  <div className="pr-dialog-warning-title">سيتم حذف:</div>
                  <ul className="pr-dialog-warning-list">
                    <li>جميع بياناتك الشخصية</li>
                    <li>تقدمك في جميع الدورات ({stats.totalWatched} درس)</li>
                    <li>إنجازاتك ونقاطك</li>
                    <li>حسابك من Firebase Auth</li>
                  </ul>
                </div>
              </div>
              {deleteError && (
                <div className="pr-dialog-error">
                  <i className="fa-solid fa-circle-xmark"></i>
                  {deleteError}
                </div>
              )}
            </div>
            <div className="pr-dialog-footer">
              <button
                className="pr-dialog-btn pr-dialog-btn-cancel"
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleteLoading}
              >
                إلغاء
              </button>
              <button
                className="pr-dialog-btn pr-dialog-btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash-can"></i>
                    نعم، احذف حسابي
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}