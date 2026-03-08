import { useEffect, useRef } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./AboutPage.css"

function Sparkles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animId
    const COLORS = ["#c2b098", "#d4c4ae", "#e8ddd0", "#f0ebe5", "#b09070", "#fff8f0"]
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    resize()
    window.addEventListener("resize", resize)
    class Particle {
      constructor() { this.reset(true) }
      reset(initial = false) {
        this.x = Math.random() * canvas.width
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10
        this.size = Math.random() * 3 + 1
        this.speedY = -(Math.random() * 0.6 + 0.2)
        this.speedX = (Math.random() - 0.5) * 0.4
        this.opacity = Math.random() * 0.7 + 0.2
        this.twinkleSpeed = Math.random() * 0.03 + 0.01
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
        this.angle = Math.random() * Math.PI * 2
        this.rotSpeed = (Math.random() - 0.5) * 0.05
        this.type = Math.random() > 0.6 ? "star" : "dot"
      }
      drawStar(ctx) {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle)
        ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color
        ctx.beginPath()
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2
          ctx.lineTo(Math.cos(a) * this.size, Math.sin(a) * this.size)
          ctx.lineTo(Math.cos(a + Math.PI/4) * this.size * 0.4, Math.sin(a + Math.PI/4) * this.size * 0.4)
        }
        ctx.closePath(); ctx.fill(); ctx.restore()
      }
      update() {
        this.y += this.speedY; this.x += this.speedX
        this.opacity += this.twinkleSpeed * this.twinkleDir
        this.angle += this.rotSpeed
        if (this.opacity > 0.9 || this.opacity < 0.1) this.twinkleDir *= -1
        if (this.y < -10) this.reset()
      }
      draw() {
        if (this.type === "star") { this.drawStar(ctx) } else {
          ctx.save(); ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color
          ctx.shadowColor = this.color; ctx.shadowBlur = this.size * 3
          ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill(); ctx.restore()
        }
      }
    }
    const particles = Array.from({ length: 120 }, () => new Particle())
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={canvasRef} className="t-sparkle-canvas" />
}

const BENEFITS = [
  {
    icon: "fa-book-open",
    title: "فهم معاني القرآن",
    desc: "التفسير يساعد المسلم على فهم معاني الآيات القرآنية، مما يمكنه من تدبرها والعمل بها.",
    verse: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ وَلِيَتَذَكَّرَ أُولُو الْأَلْبَابِ",
    surah: "سورة ص: 29"
  },
  {
    icon: "fa-scale-balanced",
    title: "توضيح الأحكام الشرعية",
    desc: "التفسير يوضح الأحكام الشرعية المستنبطة من الآيات القرآنية، مما يساعد المسلم على معرفة الحلال والحرام.",
    verse: "وَنَزَّلْنَا عَلَيْكَ الْكِتَابَ تِبْيَانًا لِّكُلِّ شَيْءٍ وَهُدًى وَرَحْمَةً وَبُشْرَىٰ لِلْمُسْلِمِينَ",
    surah: "سورة النحل: 89"
  },
  {
    icon: "fa-heart",
    title: "تقوية الإيمان",
    desc: "فهم معاني القرآن وتدبره يعزز إيمان المسلم ويزيد من تقواه، حيث يشعر بقربه من الله ويزداد يقينه.",
    verse: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ وَإِذَا تُلِيَتْ عَلَيْهِمْ آيَاتُهُ زَادَتْهُمْ إِيمَانًا",
    surah: "سورة الأنفال: 2"
  },
  {
    icon: "fa-seedling",
    title: "التربية الروحية والأخلاقية",
    desc: "التفسير يساهم في تربية المسلم روحيًا وأخلاقيًا، حيث يتعلم القيم والمبادئ الإسلامية.",
    verse: "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ وَهُدًى وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
    surah: "سورة يونس: 57"
  },
]
const EFFECTS = [
  {
    icon: "fa-moon",
    title: "الطمأنينة والسكينة",
    desc: "فهم معاني القرآن وتدبره يمنح المسلم الراحة النفسية والروحية، حيث يجد في كلام الله القوة لتحمل مصاعب الحياة.",
  },
  {
    icon: "fa-compass",
    title: "الهداية والاستقامة",
    desc: "التفسير يساعد المسلم على السير على الصراط المستقيم والالتزام بتعاليم الإسلام، مما يجعله يعيش حياة طيبة ومباركة.",
  },
  {
    icon: "fa-people-group",
    title: "التفاعل الإيجابي مع المجتمع",
    desc: "المسلم الذي يفهم معاني القرآن ويتدبرها يكون أكثر قدرة على التفاعل الإيجابي مع مجتمعه.",
  },
]

export default function AboutPage() {
  return (
    <div className="ab-page">
      <Sparkles />
      <Navbar activePage="about" />

      {/* ── HERO ──────────────────────────────────────── */}
      <div className="ab-hero">
        <div className="t-container">
          <h1 className="ab-hero-title">التفسير وأهميته في حياة المسلم</h1>
        </div>
      </div>

      {/* ── INTRO ─────────────────────────────────────── */}
      <section className="ab-section">
        <div className="t-container">
          <p className="ab-intro-text">
            التفسير هو علم يُعنى بشرح وتوضيح معاني القرآن الكريم، وهو من أهم العلوم الإسلامية التي تساعد المسلم على
            فهم كلام الله تعالى وتدبره. يُعتبر التفسير جسرًا يصل بين النص القرآني وفهم الإنسان، مما يمكنه من تطبيق
            تعاليم الإسلام في حياته اليومية.
          </p>
        </div>
      </section>

      {/* ── BENEFITS ──────────────────────────────────── */}
      <section className="ab-section ab-section-tinted">
        <div className="t-container">
          <div className="t-sec-title">
            <h3>فوائد التفسير</h3>
          </div>
          <div className="ab-cards-grid">
            {BENEFITS.map(b => (
              <div className="ab-card" key={b.title}>
                <div className="ab-card-icon">
                  <i className={`fa-solid ${b.icon}`}></i>
                </div>
                <h4 className="ab-card-title">{b.title}</h4>
                <p className="ab-card-desc">{b.desc}</p>
                {b.verse && (
                  <blockquote className="ab-verse">
                    <p>{b.verse}</p>
                    <cite>{b.ref}</cite>
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EFFECTS ───────────────────────────────────── */}
      <section className="ab-section">
        <div className="t-container">
          <div className="t-sec-title">
            <h3>تأثير التفسير على الإنسان</h3>
          </div>

          {/* Main verse */}
          <div className="ab-main-verse">
            <i className="fa-solid fa-star-and-crescent ab-main-verse-icon"></i>
            <p className="ab-main-verse-text">
              ﴿الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
            </p>
            <cite className="ab-main-verse-ref">الرعد: ٢٨</cite>
          </div>

          <div className="ab-effects-grid">
            {EFFECTS.map(e => (
              <div className="ab-effect-card" key={e.title}>
                <div className="ab-effect-icon">
                  <i className={`fa-solid ${e.icon}`}></i>
                </div>
                <div>
                  <h4 className="ab-effect-title">{e.title}</h4>
                  <p className="ab-effect-desc">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING ───────────────────────────────────── */}
      <section className="ab-closing">
        <div className="t-container">
          <div className="ab-closing-inner">
            <i className="fa-solid fa-hands-praying ab-closing-icon"></i>
            <h3 className="ab-closing-title">ختاماً</h3>
            <p className="ab-closing-text">
              التفسير هو علم جليل يساعد المسلم على فهم كلام الله وتدبره، مما يعزز إيمانه ويقوي علاقته بربه.
              ومن خلال التفسير، يستطيع المسلم أن يعيش حياة طيبة ومباركة، ملتزمًا بتعاليم الإسلام وقيمه السامية.
              نسأل الله أن يرزقنا فهم القرآن وتدبره، وأن يجعلنا من العاملين به.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}