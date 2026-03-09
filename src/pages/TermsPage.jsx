import "./LegalPage.css"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Terms() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="legal-page">
      {/* Top Actions */}
      <div className="legal-top-actions">
        <button
          className="legal-back-btn"
          onClick={() => navigate(-1)}
        >
          ← رجوع
        </button>

        {!user && (
          <button
            className="legal-login-btn"
            onClick={() => navigate("/login")}
          >
            تسجيل الدخول
          </button>
        )}
      </div>

      <div className="legal-card">

        <h1 className="legal-title">شروط الاستخدام</h1>
        <div className="legal-divider"></div>

        <div className="legal-section">
          <p>
            باستخدامك لمنصة <strong>تدبر</strong> فإنك توافق على الالتزام
            بالشروط والأحكام التالية.
          </p>
        </div>

        <div className="legal-section">
          <h3>استخدام المنصة</h3>
          <p>
            تهدف منصة تدبر إلى مساعدة المستخدمين على فهم القرآن الكريم.
            يجب استخدام المنصة لأغراض تعليمية فقط.
          </p>
        </div>

        <div className="legal-section">
          <h3>حقوق المحتوى</h3>
          <p>
            جميع المواد التعليمية والمحتوى الموجود في المنصة محفوظة حقوقها
            لأصحابها ولا يجوز إعادة نشرها دون إذن.
          </p>
        </div>

        <div className="legal-section">
          <h3>حساب المستخدم</h3>
          <p>
            المستخدم مسؤول عن استخدام حسابه بشكل صحيح وعدم مشاركة معلومات
            تسجيل الدخول مع الآخرين.
          </p>
        </div>

        <div className="legal-section">
          <h3>تعديل الشروط</h3>
          <p>
            قد نقوم بتحديث شروط الاستخدام في أي وقت، ويعتبر استمرارك في
            استخدام المنصة موافقة على التعديلات.
          </p>
        </div>

      </div>
    </div>
  )
}