// Filters out videos that don't belong to the course content
// Based on patterns in authentic tafsir videos

/**
 * Check if a video title matches the expected pattern for course content
 * @param {string} title - Video title to check
 * @param {string} courseType - Type of course ('full-quran', 'intro', 'playlist')
 * @returns {boolean} - True if video appears to be course content
 */
export function isValidCourseVideo(title, courseType = 'full-quran') {
  if (!title) return false
  
  const lowerTitle = title.toLowerCase()
  
  // Common patterns in authentic course videos
  const validPatterns = [
    'مقاطع حفظ',           // "Clips of memorization"
    'تدبر',               // "Reflection/Tafsir"
    'حلقة',               // "Episode"
    'فيديو',              // "Video" (followed by number)
    'الجنوب',             // Common in Dr. Fadel's videos
  ]
  
  // Patterns that indicate non-course content
  const invalidPatterns = [
    'هل ذُكرت',           // Question format (usually debates/discussions)
    'المقدس',             // "Holy Book" (comparative religion topics)
    'نقاش',               // "Discussion/Debate"
    'حوار',               // "Dialogue/Interview"
    'مناظرة',             // "Debate"
    'الرد على',           // "Response to"
    'تعليق على',          // "Comment on"
    'مقابلة',             // "Interview"
  ]
  
  // Check for invalid patterns first (higher priority)
  const hasInvalidPattern = invalidPatterns.some(pattern => lowerTitle.includes(pattern))
  if (hasInvalidPattern) return false
  
  // For full Quran course, check for valid patterns
  if (courseType === 'full-quran') {
    const hasValidPattern = validPatterns.some(pattern => lowerTitle.includes(pattern))
    
    // Also check if it contains a surah name (from our surah map)
    const hasSurahReference = containsSurahName(title)
    
    return hasValidPattern || hasSurahReference
  }
  
  // For other courses, use similar logic
  return validPatterns.some(pattern => lowerTitle.includes(pattern))
}

/**
 * Check if title contains a Quran surah name
 * @param {string} title - Video title
 * @returns {boolean} - True if contains surah name
 */
function containsSurahName(title) {
  if (!title) return false
  
  // Import from surahMap if needed, or check common patterns
  const surahKeywords = [
    'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 
    'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس',
    'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر',
    'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
    // Add more as needed or import from SURAH_NAME_MAP
  ]
  
  return surahKeywords.some(name => title.includes(name))
}

/**
 * Filter an array of videos to remove non-course content
 * @param {Array} videos - Array of video objects with 'title' property
 * @param {string} courseType - Type of course
 * @returns {Array} - Filtered array of valid course videos
 */
export function filterCourseVideos(videos, courseType = 'full-quran') {
  if (!Array.isArray(videos)) return []
  
  return videos.filter(video => {
    if (!video || !video.title) return false
    return isValidCourseVideo(video.title, courseType)
  })
}

/**
 * Advanced filter that also checks video number patterns
 * Many authentic videos have "فيديو ٧٧٨" style numbering
 * @param {Array} videos - Array of video objects
 * @returns {Array} - Filtered videos
 */
export function filterByVideoPattern(videos) {
  if (!Array.isArray(videos)) return []
  
  return videos.filter(video => {
    if (!video || !video.title) return false
    
    const title = video.title
    
    // Pattern 1: فيديو followed by number
    const hasVideoNumber = /فيديو\s*[\u0660-\u0669\d]+/.test(title)
    
    // Pattern 2: حلقة followed by number
    const hasEpisodeNumber = /حلقة\s*[\u0660-\u0669\d]+/.test(title)
    
    // Pattern 3: Contains tafsir keywords
    const hasTafsirKeywords = title.includes('تدبر') || 
                               title.includes('مقاطع') ||
                               title.includes('الجنوب')
    
    // Must have at least one pattern match
    const isValid = hasVideoNumber || hasEpisodeNumber || hasTafsirKeywords
    
    // But exclude if it has debate/discussion patterns
    const isDebate = title.includes('هل ذُكرت') || 
                     title.includes('المقدس') ||
                     title.includes('نقاش') ||
                     title.includes('مناظرة')
    
    return isValid && !isDebate
  })
}

/**
 * Get statistics about filtered vs total videos
 * @param {Array} originalVideos - Original video array
 * @param {Array} filteredVideos - Filtered video array
 * @returns {Object} - Statistics object
 */
export function getFilterStats(originalVideos, filteredVideos) {
  const removed = originalVideos.length - filteredVideos.length
  const removedVideos = originalVideos.filter(
    v => !filteredVideos.find(fv => fv.videoId === v.videoId)
  )
  
  return {
    total: originalVideos.length,
    valid: filteredVideos.length,
    removed: removed,
    removedTitles: removedVideos.map(v => v.title),
    removalRate: ((removed / originalVideos.length) * 100).toFixed(1) + '%'
  }
}