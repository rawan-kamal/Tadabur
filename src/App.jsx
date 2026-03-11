import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import AboutPage from "./pages/AboutPage"
import AboutUsPage from "./pages/AboutusPage"
import CoursesPage from "./pages/CoursesPage"
import CoursePage from "./pages/CoursePage"
import PlayerPage from "./pages/PlayerPage"
import FullQuranPage from "./pages/FullQuranPage"
import SurahPlayerPage from "./pages/SurahPlayerPage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from "./pages/LoginPage"
import TermsPage from "./pages/TermsPage"
import PrivacyPage from "./pages/PrivacyPage"
import ScrollToTop from "./components/ScrollToTop"
import SuggestCourseButton from "./components/SuggestCourseButton"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SuggestCourseButton />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Free Access - Browse & Watch */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/full-quran" element={<FullQuranPage />} />
        <Route path="/full-quran/:surahNumber" element={<SurahPlayerPage />} />

        {/* مفاتيح التدبر - Free Access */}
        <Route path="/mafateeh" element={<CoursePage />} />
        <Route path="/mafateeh/:videoId" element={<PlayerPage />} />

        {/* Playlist Courses - Free Access */}
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/course/:courseId/:videoId" element={<PlayerPage />} />

        {/* Protected - Profile Only */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App