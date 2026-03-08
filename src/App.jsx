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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />

        {/* Protected */}
        <Route path="/courses"    element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />

        {/* مفاتيح التدبر */}
        <Route path="/mafateeh"           element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="/mafateeh/:videoId"  element={<ProtectedRoute><PlayerPage /></ProtectedRoute>} />

        {/* Playlist courses */}
        <Route path="/course/:courseId"            element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="/course/:courseId/:videoId"   element={<ProtectedRoute><PlayerPage /></ProtectedRoute>} />

        {/* Full Quran */}
        <Route path="/full-quran"              element={<ProtectedRoute><FullQuranPage /></ProtectedRoute>} />
        <Route path="/full-quran/:surahNumber" element={<ProtectedRoute><SurahPlayerPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App