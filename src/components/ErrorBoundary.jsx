import { Component } from "react"
import "./ErrorBoundary.css"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    this.setState({ error, errorInfo })
    
    // Optional: Send to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="eb-shell">
          <div className="eb-content">
            <div className="eb-card">
              <div className="eb-icon">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              
              <h1 className="eb-title">عذراً، حدث خطأ غير متوقع</h1>
              
              <p className="eb-message">
                نعتذر عن الإزعاج. حدث خطأ أثناء تحميل هذه الصفحة.
                <br />
                يرجى تحديث الصفحة أو العودة للرئيسية.
              </p>

              <div className="eb-actions">
                <button className="eb-btn-primary" onClick={this.handleReload}>
                  <i className="fa-solid fa-rotate-right"></i>
                  تحديث الصفحة
                </button>
                <button className="eb-btn-secondary" onClick={this.handleGoHome}>
                  <i className="fa-solid fa-house"></i>
                  العودة للرئيسية
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary