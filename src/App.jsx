import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import ErrorBoundary from "./components/ErrorBoundary"
import LoadingScreen from "./components/LoadingScreen"
import ScrollToTop from "./components/ScrollToTop"
import SuggestCourseButton from "./components/SuggestCourseButton"

// Pages
import Home from "./pages/Home"
import CoursesPage from "./pages/CoursesPage"
import CoursePage from "./pages/CoursePage"
import PlayerPage from "./pages/PlayerPage"
import SurahPlayerPage from "./pages/SurahPlayerPage"
import FullQuranPage from "./pages/FullQuranPage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from "./pages/LoginPage"
import AboutPage from "./pages/AboutPage"
import AboutusPage from "./pages/AboutusPage"
import NotFound from "./pages/NotFound"
import PrivacyPage from "./pages/PrivacyPage"
import TermsPage from "./pages/TermsPage"

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingScreen message="جاري التحقق من حالة تسجيل الدخول..." />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <SuggestCourseButton />
          
          <Routes>
            {/* ── PUBLIC ROUTES ── */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/aboutus" element={<AboutusPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            
            {/* ── COURSES ── */}
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/course/:courseId/:videoId" element={<PlayerPage />} />
            
            {/* ── MAFATEEH ── */}
            <Route path="/mafateeh" element={<CoursePage />} />
            <Route path="/mafateeh/:videoId" element={<PlayerPage />} />
            
            {/* ── FULL QURAN ── */}
            <Route path="/full-quran" element={<FullQuranPage />} />
            <Route path="/full-quran/:surahNumber" element={<SurahPlayerPage />} />
            
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
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App