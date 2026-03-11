import { useLocation } from "react-router-dom"
import "./SuggestCourseButton.css"

export default function SuggestCourseButton() {
  const location = useLocation()
  
  // Google Form URL
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdbGGWF1Jl_StkyZV_UyqH2dHSgkTDkcoKOJb1dHIHSkN_iYg/viewform"

  const handleClick = () => {
    window.open(GOOGLE_FORM_URL, "_blank")
  }

  // Hide on player pages
  const isPlayerPage = 
    location.pathname.includes('/mafateeh/') ||
    location.pathname.includes('/course/') && location.pathname.split('/').length > 3 ||
    location.pathname.includes('/full-quran/') && location.pathname !== '/full-quran'

  // Don't render button on player pages
  if (isPlayerPage) return null

  return (
    <button
      className="suggest-float-btn"
      onClick={handleClick}
      aria-label="اقترح دورة"
    >
      <i className="fa-solid fa-lightbulb"></i>
      <span className="suggest-float-text">اقترح دورة</span>
    </button>
  )
}