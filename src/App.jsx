import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ErrorBoundary from "./components/ErrorBoundary"
import LoadingScreen from "./components/LoadingScreen"
import ScrollToTop from "./components/ScrollToTop"
import SuggestCourseButton from "./components/SuggestCourseButton"
import ProtectedRoute from "./components/ProtectedRoute"

// Pages — lazy loaded for code splitting
const Home          = lazy(() => import("./pages/Home"))
const CoursesPage   = lazy(() => import("./pages/CoursesPage"))
const CoursePage    = lazy(() => import("./pages/CoursePage"))
const PlayerPage    = lazy(() => import("./pages/PlayerPage"))
const SurahPlayerPage = lazy(() => import("./pages/SurahPlayerPage"))
const FullQuranPage = lazy(() => import("./pages/FullQuranPage"))
const ProfilePage   = lazy(() => import("./pages/ProfilePage"))
const LoginPage     = lazy(() => import("./pages/LoginPage"))
const AboutPage     = lazy(() => import("./pages/AboutPage"))
const AboutusPage   = lazy(() => import("./pages/AboutusPage"))
const NotFound      = lazy(() => import("./pages/NotFound"))
const PrivacyPage   = lazy(() => import("./pages/PrivacyPage"))
const TermsPage     = lazy(() => import("./pages/TermsPage"))

function Analytics() {
  const location = useLocation()
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-YYXJJ762MY", { page_path: location.pathname })
    }
  }, [location])
  return null
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Analytics />
          <ScrollToTop />
          <SuggestCourseButton />

          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* ── PUBLIC ROUTES ── */}
              <Route path="/"        element={<Home />} />
              <Route path="/about"   element={<AboutPage />} />
              <Route path="/aboutus" element={<AboutusPage />} />
              <Route path="/login"   element={<LoginPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms"   element={<TermsPage />} />

              {/* ── COURSES ── */}
              <Route path="/courses"                      element={<CoursesPage />} />
              <Route path="/course/:courseId"             element={<CoursePage />} />
              <Route path="/course/:courseId/:videoId"    element={<PlayerPage />} />

              {/* ── MAFATEEH ── */}
              <Route path="/mafateeh"           element={<CoursePage />} />
              <Route path="/mafateeh/:videoId"  element={<PlayerPage />} />

              {/* ── FULL QURAN ── */}
              <Route path="/full-quran"                element={<FullQuranPage />} />
              <Route path="/full-quran/:surahNumber"   element={<SurahPlayerPage />} />

              {/* ── PROTECTED ROUTES ── */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* ── 404 NOT FOUND ── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App