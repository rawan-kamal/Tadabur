import { useEffect, useRef } from "react"

export default function Sparkles() {
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