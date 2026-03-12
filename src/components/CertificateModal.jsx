import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import "./CertificateModal.css"

export default function CertificateModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [showCanvas, setShowCanvas] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName)
    }
  }, [user])

  const generateCertificate = () => {
    if (!name.trim()) {
      alert("من فضلك أدخل الاسم")
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Load certificate background
    const img = new Image()
    img.src = "/certificate.png" 
    img.onload = () => {
      // Clear and draw background
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Add name
      ctx.font = "45px Amiri, serif"
      ctx.fillStyle = "#24211c"
      ctx.textAlign = "center"
      ctx.fillText(name, canvas.width / 2, canvas.height / 2)

      setShowCanvas(true)
    }
  }

  const downloadCertificate = () => {
    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = `شهادة-تدبر-${name}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  if (!isOpen) return null

  return (
    <div className="cert-overlay">
      <div className="cert-modal">
        <button className="cert-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="cert-icon">
          <i className="fa-solid fa-award"></i>
        </div>

        <h2 className="cert-title">مبارك! أتممت تدبر القران الكريم كاملاً</h2>
        <p className="cert-subtitle">احصل على شهادة تقدير لإنجازك العظيم</p>

        <div className="cert-input-group">
          <label htmlFor="cert-name">الاسم على الشهادة:</label>
          <input
            id="cert-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="يفضل أن يكون بالعربية"
            className="cert-input"
          />
        </div>

        <canvas
          ref={canvasRef}
          width="1200"
          height="700"
          style={{ display: showCanvas ? "block" : "none" }}
          className="cert-canvas"
        />

        <div className="cert-buttons">
          {!showCanvas ? (
            <button className="cert-btn cert-btn-primary" onClick={generateCertificate}>
              <i className="fa-solid fa-certificate"></i> إنشاء الشهادة
            </button>
          ) : (
            <button className="cert-btn cert-btn-download" onClick={downloadCertificate}>
              <i className="fa-solid fa-download"></i> تحميل الشهادة
            </button>
          )}
        </div>
      </div>
    </div>
  )
}