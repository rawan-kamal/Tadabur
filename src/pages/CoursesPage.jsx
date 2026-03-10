import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { 
  INTRO_COURSE, 
  PLAYLIST_COURSES, 
  FULL_QURAN_COURSE,
  getFullQuranProgress 
} from "../data/courses"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./CoursesPage.css"

export default function CoursesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [courses, setCourses] = useState({ intro: [], regular: [], fullQuran: [] })

  // Calculate real status based on progress
  const getStatus = (progress) => {
    if (progress === 0) return "new"
    if (progress === 100) return "done"
    return "active"
  }

  // Helper: Get REAL progress from localStorage (counts ALL videos, not filtered cache)
  const getRealCourseProgress = (courseId) => {
    const prefix = `watch_${courseId}_`
    let totalVideos = 0
    let watchedVideos = 0
    
    // Count ALL videos in localStorage for this course
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        totalVideos++
        if (localStorage.getItem(key) === "true") {
          watchedVideos++
        }
      }
    }
    
    // If no videos found in localStorage, course hasn't been started
    if (totalVideos === 0) {
      return { watched: 0, total: 0, percent: 0 }
    }
    
    return {
      watched: watchedVideos,
      total: totalVideos,
      percent: Math.round((watchedVideos / totalVideos) * 100)
    }
  }

  // Update progress for all courses
  useEffect(() => {
    const updateProgress = () => {
      // Base course data
      const introCourseBase = {
        id: INTRO_COURSE.id,
        title: INTRO_COURSE.title,
        description: INTRO_COURSE.description || "دورة تأسيسية في مفاتيح التدبر — ابدأ من هنا لفهم أعمق للقرآن الكريم",
        path: "/mafateeh",
        instructor: "فاضل سليمان",
        level: "مبتدئ",
        color: "#c2b098",
        lessons: "40+",
        category: "intro"
      }

      const regularCoursesBase = PLAYLIST_COURSES.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || "دورة متخصصة في تفسير وتدبر أجزاء من القرآن الكريم",
        path: `/course/${course.id}`,
        instructor: course.instructor || "فاضل سليمان",
        level: course.id.includes("intro") ? "مبتدئ" : "متوسط",
        color: "#8a7a6a",
        lessons: "30+",
        category: "courses"
      }))

      const fullQuranCourseBase = {
        id: "full-quran",
        title: "تدبّر القرآن كاملاً",
        description: "رحلة شاملة في تفسير القرآن الكريم سورةً بسورة مع الشيخ فاضل سليمان — ١١٤ سورة",
        path: "/full-quran",
        instructor: "فاضل سليمان",
        level: "جميع المستويات",
        color: "#4caf8a",
        lessons: "١١٤ سورة",
        category: "full-quran"
      }

      if (user) {
        // Get Mafateeh progress (from localStorage - counts ALL videos)
        const mafateehProgress = getRealCourseProgress(INTRO_COURSE.id)
        const introWithProgress = {
          ...introCourseBase,
          progress: mafateehProgress.percent,
          status: getStatus(mafateehProgress.percent)
        }

        // Get Full Quran progress
        const fullQuranProgress = getFullQuranProgress(
          FULL_QURAN_COURSE.id, 
          FULL_QURAN_COURSE.surahs
        )
        const fullQuranWithProgress = {
          ...fullQuranCourseBase,
          progress: fullQuranProgress.percent,
          status: getStatus(fullQuranProgress.percent)
        }

        // Get regular courses progress (from localStorage - counts ALL videos)
        const regularWithProgress = regularCoursesBase.map(course => {
          const courseProgress = getRealCourseProgress(course.id)
          return {
            ...course,
            progress: courseProgress.percent,
            status: getStatus(courseProgress.percent)
          }
        })

        setCourses({
          intro: [introWithProgress],
          regular: regularWithProgress,
          fullQuran: [fullQuranWithProgress]
        })
      } else {
        // No user logged in - set default progress
        setCourses({
          intro: [{ ...introCourseBase, progress: 0, status: "new" }],
          regular: regularCoursesBase.map(c => ({ ...c, progress: 0, status: "new" })),
          fullQuran: [{ ...fullQuranCourseBase, progress: 0, status: "new" }]
        })
      }
    }

    // Initial update
    updateProgress()

    // Refresh when page becomes visible (user returns from course)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateProgress()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user])

  // Apply filters
  const filterCourses = (coursesArray) => {
    let filtered = coursesArray

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    return filtered
  }

  // Separate by category for display
  const filteredIntro = categoryFilter === "all" || categoryFilter === "intro" 
    ? filterCourses(courses.intro) 
    : []
  const filteredRegular = categoryFilter === "all" || categoryFilter === "courses"
    ? filterCourses(courses.regular)
    : []
  const filteredFullQuran = categoryFilter === "all" || categoryFilter === "full-quran"
    ? filterCourses(courses.fullQuran)
    : []

  const totalVisible = filteredIntro.length + filteredRegular.length + filteredFullQuran.length

  // Render a card
  const renderCard = (course) => (
    <div
      key={course.id}
      className="cp-card"
      onClick={() => navigate(course.path)}
    >
      {/* Color Strip */}
      <div className="cp-card-strip" style={{ background: course.color }} />

      {/* Card Body */}
      <div className="cp-card-body">
        <div className="cp-card-top">
          <h3 className="cp-card-title">{course.title}</h3>
          <span className={`cp-badge cp-badge-${course.status}`}>
            {course.status === "new" && <><i className="fa-solid fa-sparkles"></i> جديدة</>}
            {course.status === "active" && <><i className="fa-solid fa-spinner"></i> قيد الإنجاز</>}
            {course.status === "done" && <><i className="fa-solid fa-circle-check"></i> مكتملة</>}
          </span>
        </div>

        <div className="cp-meta-group">
          <div className="cp-instructor">
            <i className="fa-solid fa-user-tie cp-instructor-icon"></i>
            <span>{course.instructor}</span>
          </div>
          <div className="cp-lessons-count">
            <i className="fa-solid fa-video"></i>
            <span>{course.lessons} درس</span>
          </div>
        </div>

        <p className="cp-desc">{course.description}</p>

        {/* Level Badge */}
        <div className="cp-level-badge">
          <i className="fa-solid fa-signal"></i>
          <span>{course.level}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="cp-card-footer">
        {course.status === "active" && (
          <>
            <div className="cp-progress-row">
              <span>التقدم</span>
              <span>
                <strong>{course.progress}%</strong>
                <i className="fa-solid fa-chart-line"></i>
              </span>
            </div>
            <div className="cp-progress-bar">
              <div className="cp-progress-fill" style={{ width: `${course.progress}%` }} />
            </div>
          </>
        )}

        <button className={`cp-card-btn ${course.status === "active" ? "cp-btn-active" : course.status === "done" ? "cp-btn-done" : ""}`}>
          {course.status === "new" && <><i className="fa-solid fa-play"></i> ابدأ الآن</>}
          {course.status === "active" && <><i className="fa-solid fa-rotate-right"></i> تابع من هنا</>}
          {course.status === "done" && <><i className="fa-solid fa-redo"></i> راجع الدورة</>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="cp-page">
      <Navbar />

      {/* Hero */}
      <div className="cp-hero">
        <div className="t-container">
          <div className="cp-hero-inner">
            <h1 className="cp-hero-title">رحلتك في تدبّر القرآن الكريم</h1>
            <p className="cp-hero-sub">
              دورات في أجزاء من القرآن الكريم، أو تدبّر القرآن كاملاً — ابدأ من أي مكان
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
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
                <option value="courses">الدورات المتخصصة</option>
                <option value="full-quran">تدبّر القرآن كاملاً</option>
              </select>
              <i className="fa-solid fa-chevron-down cp-select-icon"></i>
            </div>
          </div>

          {/* Status Filter Toolbar */}
          <div className="cp-toolbar">
            <div className="cp-filters">
              <button
                onClick={() => setStatusFilter("all")}
                className={`cp-filter-btn ${statusFilter === "all" ? "active" : ""}`}
              >
                <i className="fa-solid fa-layer-group"></i>
                <span>الكل</span>
              </button>
              <button
                onClick={() => setStatusFilter("new")}
                className={`cp-filter-btn ${statusFilter === "new" ? "active" : ""}`}
              >
                <i className="fa-solid fa-star"></i>
                <span>جديدة</span>
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`cp-filter-btn ${statusFilter === "active" ? "active" : ""}`}
              >
                <i className="fa-solid fa-spinner"></i>
                <span>قيد الإنجاز</span>
              </button>
              <button
                onClick={() => setStatusFilter("done")}
                className={`cp-filter-btn ${statusFilter === "done" ? "active" : ""}`}
              >
                <i className="fa-solid fa-circle-check"></i>
                <span>مكتملة</span>
              </button>
            </div>

            <div className="cp-count">
              <i className="fa-solid fa-graduation-cap"></i>
              <span>عرض <strong>{totalVisible}</strong> دورة</span>
            </div>
          </div>

          {/* SECTION 1: Intro Courses */}
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
                {filteredIntro.map(renderCard)}
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
                      الدورات المتخصصة
                    </h2>
                    <span className="cp-section-tag cp-tag-intermediate">للمتقدمين</span>
                  </div>
                  <p className="cp-section-subtitle">دورات في تفسير أجزاء وسور محددة من القرآن الكريم</p>
                </div>
              </div>
              <div className="cp-grid">
                {filteredRegular.map(renderCard)}
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
                {filteredFullQuran.map(renderCard)}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalVisible === 0 && (
            <div className="cp-empty">
              <div className="cp-empty-icon">
                <i className="fa-solid fa-filter"></i>
              </div>
              <p>لا توجد دورات مطابقة للفلترة المحددة</p>
              <button 
                className="cp-empty-btn"
                onClick={() => {
                  setStatusFilter("all")
                  setCategoryFilter("all")
                }}
              >
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