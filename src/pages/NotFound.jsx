import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./NotFound.css"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="nf-shell">
      <Navbar />
      
      <div className="nf-content">
        <div className="nf-card">
          <div className="nf-icon">
            <i className="fa-solid fa-compass"></i>
          </div>
          <h1 className="nf-title">الصفحة غير موجودة</h1>
          <p className="nf-message">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر
          </p>
          <div className="nf-actions">
            <button className="nf-btn-primary" onClick={() => navigate("/")}>
              <i className="fa-solid fa-house"></i>
              العودة للرئيسية
            </button>
            <button className="nf-btn-secondary" onClick={() => navigate("/courses")}>
              <i className="fa-solid fa-graduation-cap"></i>
              تصفح الدورات
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}