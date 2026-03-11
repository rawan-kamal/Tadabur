import React from 'react'
import './filter-notice.css'

/**
 * FilterDebugPanel - Development tool to visualize filter statistics
 * Only show this component during development, not in production
 * 
 * Usage:
 * {process.env.NODE_ENV === 'development' && filterStats && (
 *   <FilterDebugPanel stats={filterStats} />
 * )}
 */
export function FilterDebugPanel({ stats }) {
  if (!stats) return null

  return (
    <div className="sc-filter-debug">
      <div className="sc-filter-debug-title">
        <i className="fa-solid fa-filter"></i>
        <span>Video Filter Statistics</span>
      </div>

      <div className="sc-filter-debug-stats">
        <div className="sc-filter-debug-stat">
          <span className="sc-filter-debug-stat-num">{stats.total}</span>
          <span className="sc-filter-debug-stat-label">إجمالي الفيديوهات</span>
        </div>
        <div className="sc-filter-debug-stat">
          <span className="sc-filter-debug-stat-num">{stats.valid}</span>
          <span className="sc-filter-debug-stat-label">فيديوهات صالحة</span>
        </div>
        <div className="sc-filter-debug-stat">
          <span className="sc-filter-debug-stat-num">{stats.removed}</span>
          <span className="sc-filter-debug-stat-label">تم الإزالة</span>
        </div>
        <div className="sc-filter-debug-stat">
          <span className="sc-filter-debug-stat-num">{stats.removalRate}</span>
          <span className="sc-filter-debug-stat-label">نسبة الإزالة</span>
        </div>
      </div>

      {stats.removed > 0 && (
        <>
          <div style={{ marginTop: '0.7rem', fontWeight: 600, fontSize: '0.75rem' }}>
            الفيديوهات المُزالة:
          </div>
          <div className="sc-filter-debug-list">
            {stats.removedTitles.map((title, idx) => (
              <div key={idx} className="sc-filter-debug-item">
                <i className="fa-solid fa-circle-xmark"></i>
                {title}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * FilterNotice - User-facing notice about filtered videos
 * Shows a simple message that some videos were hidden
 * 
 * Usage:
 * {filterStats?.removed > 0 && (
 *   <FilterNotice count={filterStats.removed} />
 * )}
 */
export function FilterNotice({ count, onDismiss }) {
  if (!count || count === 0) return null

  return (
    <div className={`sc-filter-notice ${onDismiss ? 'sc-filter-notice-dismissible' : ''}`}>
      <i className="fa-solid fa-filter"></i>
      <span>{count} فيديو غير متعلق بالدورة تم إخفاؤه</span>
      {onDismiss && (
        <button 
          className="sc-filter-notice-close" 
          onClick={onDismiss}
          aria-label="إغلاق"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
    </div>
  )
}

/**
 * FilterToggle - Allow users to show/hide filtered content
 * 
 * Usage:
 * const [showFiltered, setShowFiltered] = useState(false)
 * <FilterToggle 
 *   enabled={!showFiltered} 
 *   onChange={setShowFiltered}
 *   filteredCount={filterStats?.removed}
 * />
 */
export function FilterToggle({ enabled, onChange, filteredCount }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="sc-filter-toggle"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        border: '1px solid rgba(194, 176, 152, 0.3)',
        borderRadius: '100px',
        background: enabled ? 'rgba(76, 175, 138, 0.1)' : 'transparent',
        color: enabled ? '#2e7d5e' : '#8a7a6a',
        fontSize: '0.8rem',
        fontFamily: 'Cairo, sans-serif',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      <i className={`fa-solid ${enabled ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      <span>
        {enabled ? 'إخفاء' : 'عرض'} الفيديوهات غير المتعلقة
        {filteredCount > 0 && ` (${filteredCount})`}
      </span>
    </button>
  )
}

export default {
  FilterDebugPanel,
  FilterNotice,
  FilterToggle
}