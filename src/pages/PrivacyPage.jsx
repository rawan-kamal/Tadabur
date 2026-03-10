import "./LegalPage.css"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

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
            نحن في منصة <strong>تدبّر</strong> نلتزم بحماية خصوصيتك وبياناتك الشخصية. 
            هذه الصفحة تشرح بكل بساطة كيف نتعامل مع بياناتك.
          </p>
        </div>

        <div className="legal-section">
          <h3>ما المعلومات التي نجمعها؟</h3>
          <p><strong>عند تسجيل الدخول بـ Google:</strong></p>
          <ul>
            <li>اسمك</li>
            <li>بريدك الإلكتروني</li>
            <li>صورة ملفك الشخصي</li>
          </ul>
          
          <p style={{ marginTop: '1rem' }}><strong>أثناء استخدام المنصة:</strong></p>
          <ul>
            <li>الدروس التي أتممتها</li>
            <li>نسبة تقدمك في كل دورة</li>
          </ul>
          
          <p style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(76, 175, 138, 0.1)', borderRight: '3px solid #4caf8a', borderRadius: '8px', color: '#2e7d5e' }}>
            💡 لا نطلب أو نحفظ كلمة المرور الخاصة بك — Google يتولى ذلك بشكل آمن تماماً
          </p>
        </div>

        <div className="legal-section">
          <h3>لماذا نحتاج هذه المعلومات؟</h3>
          <ul>
            <li><strong>حفظ تقدمك:</strong> حتى تجد دروسك محفوظة عند عودتك</li>
            <li><strong>تمييز حسابك:</strong> حتى نعرف من أنت ونعرض لك تقدمك الشخصي</li>
            <li><strong>حماية حسابك:</strong> منع الوصول غير المصرح به</li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>هل تشارك بياناتنا مع أحد؟</h3>
          <p style={{ padding: '1rem', background: 'rgba(76, 175, 138, 0.1)', border: '2px solid #4caf8a', borderRadius: '10px', color: '#2e7d5e', fontWeight: '600', marginBottom: '1rem' }}>
            ⚠️ نحن لا نبيع أو نشارك بياناتك مع أي شركات إعلانات. أبداً.
          </p>
          <p>
            نستخدم فقط خدمات موثوقة وآمنة:
          </p>
          <ul>
            <li><strong>Google Firebase</strong> (للتسجيل وحفظ البيانات)</li>
            <li><strong>YouTube</strong> (للفيديوهات)</li>
            <li><strong>Quran.com</strong> (للمصحف)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>كيف نحمي معلوماتك؟</h3>
          <ul>
            <li><strong>التشفير:</strong> جميع بياناتك مشفرة ومحمية</li>
            <li><strong>خوادم Google الآمنة:</strong> نستخدم Firebase من Google بأعلى معايير الأمان</li>
            <li><strong>خصوصية تامة:</strong> كل مستخدم يرى تقدمه فقط، لا أحد غيره</li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>حقوقك الكاملة</h3>
          <ul>
            <li><strong>عرض بياناتك:</strong> شاهد كل معلوماتك من ملفك الشخصي</li>
            <li><strong>حذف حسابك:</strong> احذف حسابك وجميع بياناتك نهائياً متى شئت</li>
            <li><strong>تصدير بياناتك:</strong> احصل على نسخة من معلوماتك بالتواصل معنا</li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>ملفات الارتباط (Cookies)</h3>
          <p>
            نستخدم ملفات صغيرة (cookies) لنتذكرك عند العودة وللحفاظ على تسجيل دخولك. 
            هذا يجعل تجربتك أسهل وأسرع.
          </p>
        </div>

        <div className="legal-section">
          <h3>تواصل معنا</h3>
          <p>
            عندك سؤال أو استفسار؟ راسلنا على: <a href="mailto:team.tadabur@gmail.com" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>team.tadabur@gmail.com</a>
          </p>
        </div>

        <div className="legal-section" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(194, 176, 152, 0.2)' }}>
          <p style={{ textAlign: 'center', color: '#8a7a6a', fontSize: '0.9rem' }}>
            شكراً لثقتك في منصة تدبّر. نحن ملتزمون بحماية خصوصيتك وتوفير تجربة آمنة لك.
          </p>
          <p style={{ textAlign: 'center', color: '#a09080', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            آخر تحديث: مارس ٢٠٢٦
          </p>
        </div>

      </div>
    </div>
  )
}