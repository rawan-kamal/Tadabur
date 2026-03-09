import { useNavigate } from "react-router-dom"
import { PLAYLIST_COURSES, INTRO_COURSE, FULL_QURAN_COURSE } from "../data/courses"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Sparkles from "../components/Sparkles"
import "./Home.css"
import "../responsive-fixes.css"


const WHY_CARDS = [
  { icon: "fa-book-quran", title: "تفسير شامل", desc: "تغطية لكل سور القرآن الكريم مع شرح دقيق لكل آية." },
  { icon: "fa-chart-line", title: "متابعة التقدم", desc: "يمكنك تتابع تقدمك خلال كل سورة." },
  { icon: "fa-rotate", title: "عرض متزامن للآيات", desc: "شاشة مدمجة تعرض الآيات أثناء شرحها." },
  { icon: "fa-circle-check", title: "سهولة الوصول والتنظيم", desc: "منصة سهلة الاستخدام، توفر تفسيرًا واضحًا ومتاحًا في أي وقت." },
]

const JOURNEY_CARDS = [
  {
    icon: "./icons/quarter.png",
    title: "شاهد وتعلّم",
    desc: "استمتع بتجربة تعليمية متكاملة تجمع بين التلاوة، الشرح، والمقاطع التعليمية المختارة بعناية."
  },
  {
    icon: "./icons/half-circle.png",
    title: "افهم الآيات بشكل أعمق",
    desc: "تأمل الآيات مع أدوات تساعدك على الربط بين التلاوة والشرح والتفسير."
  },
  {
    icon: "./icons/three-quarters.png",
    title: "تتبع تقدمك",
    desc: "اعرف مكانك في الرحلة دائماً من خلال نظام متابعة دقيق يوضح إنجازك في كل سورة وكل درس."
  },
  {
    icon: "./icons/circle.png",
    title: "ابدأ رحلتك",
    desc: "استكشف منهج تدبّر المصمم خصيصاً ليقودك خطوة بخطوة نحو فهم أعمق للقرآن."
  }
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <Sparkles />

      <Navbar />

      {/* ── HERO ───────────────────────────────── */}
      <section className="h-gradient-bg">
        <div className="h-container">
          <div className="h-hero-row">
            <div className="h-hero-text">
              <p className="h-hero-title">منصة تدبّر — رحلتك المنظمة لتدبر القرآن الكريم</p>
              <p className="h-hero-desc">منصة متكاملة لتدبر القرآن الكريم، متاحة للجميع مجاناً وبدون أي رسوم.</p>
              <div className="h-hero-btns">
                <button className="h-btn-dark h-rounded-pill"
                  onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}>
                  ابدأ الان
                </button>
                <button className="h-btn-outline-main h-rounded-pill"
                  onClick={() => navigate("/courses")}>
                  استكشف المسارات
                </button>
              </div>
            </div>
            <div className="h-hero-img">
              <img src="./hero-img.png" alt="Quran Picture" className="h-hero-circle-img" />
            </div>
          </div>

          {/* Features bar */}
          <div className="h-course-details">
            {[
              { icon: "fa-dollar-sign", text: "محتوي مجاني بالكامل" },
              { icon: "fa-chart-pie", text: "تتبع تقدمك خلال الدورات" },
              { icon: "fa-sync-alt", text: "مصحف متزامن مع كل فيديو" },
              { icon: "fa-user", text: "حساب شخصي لحفظ التقدم" },
            ].map(f => (
              <div className="h-detail-item" key={f.text}>
                <i className={`fas ${f.icon}`}></i>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TADABBUR ───────────────────────── */}
      <section className="h-section" id="journey">
        <div className="h-container">
          <div className="h-sec-title">
            <h3><span className="h-fs-40">لماذا تختار تدبر؟</span></h3>
          </div>
          <div className="h-cards-grid">
            {WHY_CARDS.map(c => (
              <div className="h-card h-border-main" key={c.title}>
                <div className="h-card-body">
                  <div className="h-card-icon">
                    <i className={`fa-solid ${c.icon} h-icon-lg`}></i>
                  </div>
                  <div>
                    <h5 className="h-card-title">{c.title}</h5>
                    <p className="h-card-text">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY SECTION ────────────────────── */}
      <section className="h-section h-gradient-bg-2" id="about">
        <div className="h-container">
          <div className="h-journey-row">
            <div className="h-journey-text">
              <h3 className="h-fs-40">رحلتك مع تدبر</h3>
              <p className="h-journey-desc">
                رحلتك مع تدبّر تبدأ من هنا، حيث نساعدك على فهم القرآن بعمق وتنظيم.
                استمتع بتجربة تعليمية فريدة تأخذك خطوة بخطوة نحو تأمل آيات الله والعمل بها في حياتك اليومية.
              </p>
              <button className="h-btn-main h-rounded-pill h-px-5"
                onClick={() => navigate("/full-quran")}>
                ابدأ الآن
              </button>
            </div>
            <div className="h-journey-cards">
              {JOURNEY_CARDS.map(c => (
                <div className="h-journey-card h-border-main" key={c.title}>
                  <div className="h-journey-card-body">
                    <div className="h-card-icon">
                        <img src={c.icon} alt="icon" />
                    </div>
                    <h6 className="h-journey-card-title">{c.title}</h6>
                    <p className="h-journey-card-text">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MUSHAF SECTION ────────────────────────────── */}
    <div className="h-container">
    <div className="h-mushaf-wrap">
        <div className="h-mushaf-overlay">
        <div className="h-mushaf-text">
            <h2 className="h-mushaf-title">مصحف متزامن</h2>
            <p className="h-mushaf-desc">شاهد الآيات أثناء شرحها</p>
            <button className="h-btn-main h-rounded-pill h-px-5"
            onClick={() => navigate("/courses")}>
            ابدأ الآن
            </button>
        </div>
        <div className="h-mushaf-img">
            <img src="./screenshot.png" alt="مصحف" />
        </div>
        </div>
    </div>
    </div>

      {/* ── TRACKS ─────────────────────────────── */}
      <div className="h-container" id="tracks">
        <div className="h-sec-title">
          <h3><span className="h-fs-40">مساراتنا</span></h3>
        </div>
        <div className="h-tracks-grid" id="courses">
          <div className="h-track-card h-track-card-img1 h-rounded-left" >
            <div className="overlay h-rounded-left">
               <h2 className="h-track-title">تعلم مفاتيح التدبر</h2>
                <p className="h-track-desc">
                    ابدأ رحلتك من الأساسيات عبر منهج مبسّط يعرّفك على أهم مفاتيح التدبّر، وكيفية فهم المعاني
                    وربط الآيات بسياقها، لتتمكن من التدبّر الصحيح في أي سورة.
                </p>
                <button className="h-track-arrow-btn" onClick={() => navigate("/mafateeh")}>
                    <i className="bi bi-arrow-up-left-circle-fill h-arrow-icon"></i>
            </button> 
            </div>
          </div>

          <div className="h-track-card h-track-card-img2 h-rounded-middle" >
            <div className="overlay h-rounded-middle">
            <h2 className="h-track-title">تدبر القران كاملا</h2>
            <p className="h-track-desc">
              انطلق في رحلة شاملة تغطي القرآن الكريم كاملاً من خلال دورات متكاملة يقدمها شيوخ متخصصون،
              مصمّمة لتمنحك فهماً تدريجياً وواضحاً للمعاني.
            </p>
            <button className="h-track-arrow-btn" onClick={() => navigate("/full-quran")}>
              <i className="bi bi-arrow-up-left-circle-fill h-arrow-icon"></i>
            </button>
            </div>      
          </div>

          <div className="h-track-card h-track-card-img3 h-rounded-right" >
            <div className="overlay h-rounded-right">
            <h2 className="h-track-title">دورات متنوعة</h2>
            <p className="h-track-desc">
              دوراتنا مختارة بعناية لمساعدتك على بناء علاقة أعمق مع القرآن، خطوة بخطوة.
              استكشف مجموعة متنوعة من الدورات التخصصية التي تغطي مواضيع قرآنية مختلفة.
            </p>
            <button className="h-track-arrow-btn" onClick={() => navigate("/courses")}>
              <i className="bi bi-arrow-up-left-circle-fill h-arrow-icon"></i>
            </button>
            </div>  
          </div>
        </div>
      </div>

      {/* ── BEST COURSES ───────────────────────── */}
      <section className="h-best-section">
        <div className="h-container">
          <div className="h-sec-title">
            <h3><span className="h-fs-40">أفضل دوراتنا</span></h3>
          </div>
          <div className="h-best-grid">

            {/* FEATURED CARD — Full Quran */}
            <div className="h-best-card h-best-featured" onClick={() => navigate("/full-quran")}>
              <div className="h-best-card-glow" />
              <div className="h-best-tag">الأشمل</div>
              <h3 className="h-best-title">{FULL_QURAN_COURSE.title}</h3>
              <p className="h-best-instructor">{FULL_QURAN_COURSE.instructor}</p>
              <p className="h-best-desc">رحلة شاملة سورة بسورة مع المصحف المتزامن — ١١٤ سورة كاملة</p>
              <div className="h-best-chips">
                <span>١١٤ سورة</span>
                <span>٨٠٠+ فيديو</span>
                <span>مجاني</span>
              </div>
              <button className="h-best-btn h-best-btn-gold h-rounded-pill">ابدأ الآن ←</button>
            </div>

            {/* CARD 2 — Mafateeh */}
            <div className="h-best-card" onClick={() => navigate("/mafateeh")}>
              <h3 className="h-best-title">{INTRO_COURSE.title}</h3>
              <p className="h-best-instructor">{INTRO_COURSE.instructor}</p>
              <p className="h-best-desc">تعلّم أساسيات التدبر ومفاتيح فهم القرآن — نقطة البداية الصحيحة</p>
              <div className="h-best-chips">
                <span>للمبتدئين</span>
                <span>٣٠+ درس</span>
              </div>
              <button className="h-best-btn h-best-btn-outline h-rounded-pill">ابدأ الآن ←</button>
            </div>

            {/* CARD 3 — First Playlist */}
            <div className="h-best-card" onClick={() => navigate(`/course/${PLAYLIST_COURSES[0]?.id}`)}>
              <h3 className="h-best-title">{PLAYLIST_COURSES[0]?.title || "دورة متخصصة"}</h3>
              <p className="h-best-instructor">{PLAYLIST_COURSES[0]?.instructor || ""}</p>
              <p className="h-best-desc">{PLAYLIST_COURSES[0]?.description || "دورة متخصصة في التفسير والتدبر القرآني"}</p>
              <div className="h-best-chips">
                <span>تفسير</span>
                <span>تدبر</span>
              </div>
              <button className="h-best-btn h-best-btn-outline h-rounded-pill">ابدأ الآن ←</button>
            </div>

          </div>

          <div className="h-best-more">
            <button className="h-btn-outline-main h-rounded-pill h-px-5"
              onClick={() => navigate("/courses")}>
              استعرض كل الدورات ←
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}