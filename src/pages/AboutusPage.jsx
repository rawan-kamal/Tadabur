import { useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useState } from "react"
import "./AboutusPage.css"

function Sparkles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animId
    const COLORS = ["#c2b098","#d4c4ae","#e8ddd0","#f0ebe5","#b09070","#fff8f0"]
    const resize = () => { canvas.width = window.innerWidth; canvas.height = document.documentElement.scrollHeight }
    resize(); window.addEventListener("resize", resize)
    class Particle {
      constructor() { this.reset(true) }
      reset(initial=false) {
        this.x=Math.random()*canvas.width; this.y=initial?Math.random()*canvas.height:canvas.height+10
        this.size=Math.random()*3+1; this.speedY=-(Math.random()*0.6+0.2); this.speedX=(Math.random()-0.5)*0.4
        this.opacity=Math.random()*0.7+0.2; this.twinkleSpeed=Math.random()*0.03+0.01
        this.twinkleDir=Math.random()>0.5?1:-1; this.color=COLORS[Math.floor(Math.random()*COLORS.length)]
        this.angle=Math.random()*Math.PI*2; this.rotSpeed=(Math.random()-0.5)*0.05
        this.type=Math.random()>0.6?"star":"dot"
      }
      update() {
        this.y+=this.speedY; this.x+=this.speedX; this.opacity+=this.twinkleSpeed*this.twinkleDir
        this.angle+=this.rotSpeed
        if(this.opacity>0.9||this.opacity<0.1) this.twinkleDir*=-1
        if(this.y<-10) this.reset()
      }
      draw() {
        if(this.type==="star"){
          ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.angle)
          ctx.globalAlpha=this.opacity; ctx.fillStyle=this.color; ctx.beginPath()
          for(let i=0;i<4;i++){const a=(i*Math.PI)/2; ctx.lineTo(Math.cos(a)*this.size,Math.sin(a)*this.size); ctx.lineTo(Math.cos(a+Math.PI/4)*this.size*0.4,Math.sin(a+Math.PI/4)*this.size*0.4)}
          ctx.closePath(); ctx.fill(); ctx.restore()
        } else {
          ctx.save(); ctx.globalAlpha=this.opacity; ctx.fillStyle=this.color
          ctx.shadowColor=this.color; ctx.shadowBlur=this.size*3
          ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); ctx.restore()
        }
      }
    }
    const particles=Array.from({length:120},()=>new Particle())
    const animate=()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw()}); animId=requestAnimationFrame(animate) }
    animate()
    return ()=>{ cancelAnimationFrame(animId); window.removeEventListener("resize",resize) }
  },[])
  return <canvas ref={canvasRef} className="t-sparkle-canvas" />
}

const FAQ = [
  {
    q: "كيف أبدأ رحلتي على المنصة؟",
    a: "سجّل دخولك بحسابك على Google بنقرة واحدة، ثم انتقل إلى صفحة الدورات واختر ما يناسبك — سواء كانت دورة كاملة أو تدبر سورة معينة.",
  },
  {
    q: "هل تقدمي محفوظ عند إغلاق المتصفح؟",
    a: "نعم، يُحفظ تقدمك تلقائيًا في كل درس تشاهده. في المرة القادمة ستجد زر «تابع من حيث توقفت» يأخذك مباشرة للدرس التالي.",
  },
  {
    q: "ما الفرق بين الدورات المتاحة؟",
    a: "تتضمن المنصة حالياً: دورة مفاتيح التدبر (أساسيات فهم القرآن)، تدبر القرآن كاملاً سورة بسورة، وعدة دورات متخصصة في تفسير أجزاء وسور محددة مع مشايخ متعددين.",
  },
  {
    q: "ما المصحف الذي يظهر بجانب الفيديو؟",
    a: "يعرض المشغّل مصحفًا من موقع quran.com متزامنًا تلقائيًا مع الدرس — يفتح على السورة أو الجزء الذي يتناوله الفيديو مباشرةً.",
  },
  {
    q: "هل المحتوى مجاني بالكامل؟",
    a: "نعم، جميع الدورات والمحتوى متاح مجانًا بالكامل ولا توجد أي اشتراكات أو رسوم.",
  },
]

export default function AboutUsPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="au-page">
      <Sparkles />
      <Navbar activePage="about-us" />

      {/* ── HERO ─────────────────────────────────────── */}
      <div className="au-hero">
        <div className="t-container">
          <div className="au-hero-inner">
            <div className="au-hero-text">
              <h1 className="au-hero-title">من نحن</h1>
              <p className="au-hero-desc">
                تدبّر منصة تعليمية مجانية تجمع أكثر من <strong>١٠٠٠ فيديو</strong> في تفسير وتدبر القرآن الكريم في
                مكان واحد منظّم. صمّمناها لتكون رحلتك مع القرآن أسهل وأعمق — بمصحف متزامن مع كل درس، وتتبع تقدم
                حقيقي، ودورات لمشايخ متعددين.
              </p>
              <button className="t-btn-dark t-pill au-hero-btn" onClick={() => navigate("/courses")}>
                استكشف الدورات <i className="fa-solid fa-arrow-left"></i>
              </button>
            </div>
            <div className="au-hero-img">
              <img src="./hero-img.png" alt="Quran" className="au-hero-circle" />
            </div>
          </div>
        </div>
      </div>

      {/* ── PLATFORM FEATURES ────────────────────────── */}
      <section className="au-section">
        <div className="t-container">
          <div className="t-sec-title"><h3>ما الذي تقدمه المنصة؟</h3></div>
          <div className="au-features-grid">
            {[
              {
                icon: "fa-book-quran",
                title: "تدبر القرآن كاملاً",
                desc: "١١٤ سورة مع سلسلة تفسير كاملة للمهندس فاضل سليمان — كل سورة بقائمة تشغيل مستقلة يمكنك متابعتها بالترتيب.",
              },
              {
                icon: "fa-chalkboard-user",
                title: "دورات من مشايخ متعددين",
                desc: "دورات متخصصة في تفسير أجزاء وسور محددة مع مشايخ كالشيخ عمرو الشرقاوي وشريف علي وأحمد عامر وغيرهم.",
              },
              {
                icon: "fa-arrows-rotate",
                title: "مصحف متزامن مع الفيديو",
                desc: "عند مشاهدة أي درس، يفتح مصحف quran.com تلقائيًا على السورة أو الجزء الذي يتناوله الشيخ في نفس الشاشة.",
              },
              {
                icon: "fa-chart-line",
                title: "تتبع التقدم تلقائياً",
                desc: "كل درس تُكمله يُحفظ فورًا. تظهر نسبة تقدمك في كل دورة وتعود من حيث توقفت في أي وقت وعلى أي جهاز.",
              },
              {
                icon: "fa-magnifying-glass",
                title: "بحث داخل كل دورة",
                desc: "ابحث بالكلمة داخل قائمة دروس أي دورة للوصول السريع إلى السورة أو الموضوع الذي تريده.",
              },
              {
                icon: "fa-lock-open",
                title: "مجاني بالكامل",
                desc: "جميع الدورات والمحتوى متاح مجانًا تمامًا. سجّل دخولك بـ Google وابدأ فورًا بدون أي رسوم.",
              },
            ].map(f => (
              <div className="au-feature-card" key={f.title}>
                <div className="au-gv-icon"><i className={`fa-solid ${f.icon}`}></i></div>
                <h4 className="au-gv-title">{f.title}</h4>
                <p className="au-gv-text">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Platform stats */}
          <div className="au-platform-stats">
            {[
              { icon: "fa-video",      num: "+١٠٠٠",  label: "فيديو تعليمي" },
              { icon: "fa-book-open",  num: "١١٤",    label: "سورة قرآنية" },
              { icon: "fa-graduation-cap", num: "٦+", label: "دورة متخصصة" },
              { icon: "fa-user-tie",   num: "٤+",     label: "مشايخ ومقدمين" },
            ].map(s => (
              <div className="au-stat" key={s.label}>
                <i className={`fa-solid ${s.icon} au-stat-icon`}></i>
                <span className="au-stat-num">{s.num}</span>
                <span className="au-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOAL & VISION ────────────────────────────── */}
      <section className="au-section au-section-tinted">
        <div className="t-container">
          <div className="t-sec-title"><h3>هدفنا ورؤيتنا</h3></div>
          <div className="au-gv-grid">
            <div className="au-gv-card">
              <div className="au-gv-icon"><i className="fa-solid fa-bullseye"></i></div>
              <h3 className="au-gv-title">هدفنا</h3>
              <p className="au-gv-text">
                جمع أفضل محتوى تدبر القرآن الكريم في منصة واحدة منظمة وسهلة الاستخدام — بحيث يجد كل مسلم طريقه
                للتدبر بغض النظر عن مستواه أو وقته، مع تتبع تقدم حقيقي يحفّزه على الاستمرار.
              </p>
            </div>
            <div className="au-gv-card">
              <div className="au-gv-icon"><i className="fa-solid fa-eye"></i></div>
              <h3 className="au-gv-title">رؤيتنا</h3>
              <p className="au-gv-text">
                أن تكون تدبّر المرجع الأول لكل من يريد فهم القرآن الكريم وتدبره بأسلوب عصري — منصة تنمو مع
                المستخدم وتوفر له المصحف والشرح والتتبع في مكان واحد، على كل جهاز وفي أي وقت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEVELOPER ────────────────────────────────── */}
      <section className="au-section au-section-tinted">
        <div className="t-container">
          <div className="t-sec-title"><h3>المطوّرة</h3></div>
          <div className="au-dev-card">
            <div className="au-dev-avatar">
              <i className="fa-solid fa-code"></i>
            </div>
            <div className="au-dev-info">
              <h3 className="au-dev-name">روان كمال</h3>
              <p className="au-dev-bio">
                 مطورة برمجيات، بنت منصة تدبّر كمشروع شخصي من فكرة بسيطة — تنظيم محتوى قرآني متفرق في تجربة
                تعليمية متكاملة. المنصة مبنية بـ React وFirebase وتعمل بالكامل من المتصفح.
              </p>
              <div className="au-dev-links">
                <a href="https://github.com/rawan-kamal" target="_blank" rel="noreferrer" className="au-dev-link">
                  <i className="fa-brands fa-github"></i>
                  GitHub
                </a>
                <a href="https://linkedin.com/in/-rawankamal" target="_blank" rel="noreferrer" className="au-dev-link">
                  <i className="fa-brands fa-linkedin"></i>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="au-section">
        <div className="t-container">
          <div className="t-sec-title"><h3>الأسئلة الشائعة</h3></div>
          <p className="au-faq-sub">إجابات على الأسئلة الأكثر شيوعًا حول موقعنا ورحلتك التفاعلية</p>
          <div className="au-faq-list">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className={`au-faq-item ${openFaq === i ? "au-faq-open" : ""}`}
              >
                <button
                  className="au-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <i className={`fa-solid ${openFaq === i ? "fa-chevron-up" : "fa-chevron-down"} au-faq-chevron`}></i>
                </button>
                {openFaq === i && (
                  <div className="au-faq-a">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}