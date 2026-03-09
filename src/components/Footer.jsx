import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Footer.css"



export default function Footer() {
  const navigate = useNavigate()
  const { user, login, logout } = useAuth()

  return (
    <footer className="h-footer">
      <div className="h-container">
        <div className="h-footer-grid">
          <div className="h-footer-col">
            <div className="h-footer-logo">
              <img src="./-favicon-color.png" alt="logo" width="40"
                onError={e => { e.target.style.display = "none" }} />
              <h5 className="main-color">تدبر</h5>
            </div>
            <p className="h-footer-desc">منصة متكاملة لتدبر القرآن الكريم بسهولة ويسر.</p>
            <ul className="h-footer-links">
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("/aboutus") }}>من نحن</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("/about") }}>عن التفسير</a></li>
              <li>
              <a href="#" onClick={e => { e.preventDefault(); navigate("/privacy") }}>
              سياسة الخصوصية
              </a>
              </li>

              <li>
              <a href="#" onClick={e => { e.preventDefault(); navigate("/terms") }}>
              شروط الاستخدام
              </a>
              </li>
            </ul>
          </div>
          <div className="h-footer-col">
            <h5 className="h-footer-col-title">المنصة</h5>
            <ul className="h-footer-links">
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("/courses") }}>جميع الدورات</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("/mafateeh") }}>مفاتيح التدبر</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); navigate("/full-quran") }}>تدبر القرآن</a></li>
            </ul>
          </div>
          <div className="h-footer-col">
            <h5 className="h-footer-col-title">حسابك</h5>
            <ul className="h-footer-links">
              <li>
                <a href="#" onClick={e => { e.preventDefault(); user ? navigate("/profile") : login() }}>
                  {user ? "ملفي الشخصي" : "تسجيل دخول"}
                </a>
              </li>
              {user && (
                <li><a href="#" onClick={e => { e.preventDefault(); logout() }}>تسجيل الخروج</a></li>
              )}
            </ul>
          </div>
        </div>
        <hr className="h-footer-hr" />
        <div className="h-footer-bottom">
          <p>© 2026 جميع الحقوق محفوظة - منصة تدبر</p>
          <p>تم التصميم بواسطة <strong>روان كمال</strong></p>
        </div>
      </div>
    </footer>
  )
}