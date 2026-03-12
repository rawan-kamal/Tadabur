import "./LoadingScreen.css"

export default function LoadingScreen({ message = "جاري التحميل..." }) {
  return (
    <div className="ls-shell">
      <div className="ls-content">
        <div className="ls-spinner">
          <div className="ls-spinner-ring"></div>
          <div className="ls-spinner-ring"></div>
          <div className="ls-spinner-ring"></div>
          <i className="fa-solid fa-book-quran ls-spinner-icon"></i>
        </div>
        <p className="ls-message">{message}</p>
      </div>
    </div>
  )
}