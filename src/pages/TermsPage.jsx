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
            منصة <strong>تدبّر</strong> مجانية للجميع. باستخدامك للمنصة، أنت توافق على هذه الشروط البسيطة.
          </p>
        </div>

        <div className="legal-section">
          <h3>ما الذي تقدمه المنصة؟</h3>
          <ul>
            <li><strong>أكثر من ١٠٠٠ فيديو</strong> في تفسير وتدبر القرآن الكريم</li>
            <li><strong>مصحف متزامن</strong> يفتح تلقائياً مع كل درس</li>
            <li><strong>تتبع تلقائي</strong> يحفظ تقدمك في كل دورة</li>
            <li><strong>مجاني تماماً</strong> بدون أي رسوم أو اشتراكات</li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>حسابك ومسؤوليتك</h3>
          <ul>
            <li><strong>معلومات صحيحة:</strong> استخدم معلومات حقيقية عند التسجيل</li>
            <li><strong>حافظ على حسابك:</strong> أنت المسؤول عن أمان حسابك</li>
            <li><strong>لا تشارك حسابك:</strong> كل شخص يحتاج حساب خاص به</li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>الاستخدام المقبول</h3>
          <p><strong>يمكنك:</strong></p>
          <ul>
            <li>مشاهدة جميع الدروس مجاناً</li>
            <li>تتبع تقدمك الشخصي</li>
            <li>استخدام المصحف المتزامن</li>
            <li>البحث في الدروس</li>
            <li>التعلم بالسرعة التي تناسبك</li>
          </ul>
          
          <p style={{ marginTop: '1rem' }}><strong>ممنوع:</strong></p>
          <ul>
            <li>نسخ أو إعادة نشر المحتوى</li>
            <li>استخدام المنصة لأغراض تجارية</li>
            <li>محاولة اختراق النظام</li>
            <li>إرسال محتوى ضار</li>
            <li>انتحال شخصية الآخرين</li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>حقوق الملكية</h3>
          <p>
            <strong>المنصة (التصميم والبرمجة):</strong> مملوكة للمطوّرة روان كمال
          </p>
          <p>
            <strong>الفيديوهات التعليمية:</strong> مملوكة للمشايخ والمقدمين (فاضل سليمان، عمرو الشرقاوي، وغيرهم). 
            نحن فقط ننظمها ونعرضها من YouTube.
          </p>
          <p>
            <strong>المصحف:</strong> من خدمة Quran.com المجانية
          </p>
        </div>

        <div className="legal-section">
          <h3>تنبيه مهم</h3>
          <p>
            <strong>المنصة متاحة "كما هي"</strong> — نبذل قصارى جهدنا لتوفير أفضل تجربة، 
            لكننا لا نضمن عدم وجود أخطاء تقنية أو انقطاع في الخدمة.
          </p>
          <p>
            المحتوى التعليمي يمثل آراء واجتهادات المشايخ. ننصحك بالرجوع لعلماء موثوقين 
            لأي استفسارات شرعية.
          </p>
        </div>

        <div className="legal-section">
          <h3>الخدمات الخارجية</h3>
          <p>
            عند استخدامك للمنصة، أنت توافق أيضاً على شروط الخدمات التالية:
          </p>
          <ul>
            <li><strong>Google</strong> (للتسجيل وحفظ البيانات)</li>
            <li><strong>YouTube</strong> (للفيديوهات التعليمية)</li>
            <li><strong>Quran.com</strong> (للمصحف المتزامن)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>التعديلات</h3>
          <p>
            قد نحدّث هذه الشروط من وقت لآخر. سنخبرك بأي تغييرات مهمة. 
            استمرارك في استخدام المنصة يعني موافقتك على الشروط الجديدة.
          </p>
        </div>

        <div className="legal-section">
          <h3>تواصل معنا</h3>
          <p>
            عندك سؤال؟ راسلنا على: <a href="mailto:team.tadabur@gmail.com" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>team.tadabur@gmail.com</a>
          </p>
        </div>

        <div className="legal-section" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(194, 176, 152, 0.2)' }}>
          <p style={{ textAlign: 'center', color: '#8a7a6a', fontSize: '0.9rem' }}>
            بارك الله فيك على استخدامك لمنصة تدبّر. نسأل الله أن ينفعك بما تعلّمت.
          </p>
          <p style={{ textAlign: 'center', color: '#a09080', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            آخر تحديث: مارس ٢٠٢٦
          </p>
        </div>

      </div>
    </div>
  )
}