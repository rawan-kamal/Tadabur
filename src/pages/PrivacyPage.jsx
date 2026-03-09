import "./LegalPage.css"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Privacy() {
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

        <h1 className="legal-title">سياسة الخصوصية</h1>
        <div className="legal-divider"></div>

        <div className="legal-section">
          <p>
            في منصة <strong>تدبر</strong> نحترم خصوصيتك ونسعى لحماية بياناتك
            الشخصية. توضح هذه الصفحة كيفية جمع واستخدام المعلومات عند استخدامك
            للمنصة.
          </p>
        </div>

        <div className="legal-section">
          <h3>المعلومات التي نقوم بجمعها</h3>
          <ul>
            <li>الاسم والبريد الإلكتروني عند تسجيل الدخول.</li>
            <li>تقدمك في الدورات أو السور التي تشاهدها.</li>
            <li>بعض البيانات التقنية لتحسين تجربة الاستخدام.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>كيف نستخدم المعلومات</h3>
          <p>
            نستخدم هذه المعلومات لإنشاء حساب المستخدم، حفظ التقدم في الدورات،
            وتحسين تجربة التعلم داخل المنصة.
          </p>
        </div>

        <div className="legal-section">
          <h3>مشاركة البيانات</h3>
          <p>
            لا نقوم ببيع أو مشاركة بيانات المستخدمين مع أي جهة خارجية إلا إذا
            كان ذلك مطلوبًا بموجب القانون.
          </p>
        </div>

        <div className="legal-section">
          <h3>تحديث السياسة</h3>
          <p>
            قد نقوم بتحديث سياسة الخصوصية من وقت لآخر، وسيتم نشر أي تغييرات
            على هذه الصفحة.
          </p>
        </div>

      </div>
    </div>
  )
}