import { useState, useEffect } from "react"

const API_KEY = "AIzaSyCGrkfBM9UH6tExzJVBDDRghp8avEBnnqE"
const CACHE_KEY = (playlistId) => `yt_cache_${playlistId}`

// Filter out private/deleted videos
function isValidVideo(video) {
  const title = video.title?.trim().toLowerCase() || ""
  
  // Exclude if title is empty
  if (!title) return false
  
  // Exclude common private/deleted video titles
  const invalidTitles = [
    "private video",
    "deleted video",
    "vidéo privée", // French
    "video privado", // Spanish
    "[private video]",
    "[deleted video]",
  ]
  
  return !invalidTitles.includes(title)
}

export function usePlaylistVideos(playlistId) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!playlistId) return

    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY(playlistId))
    if (cached) {
      const cachedVideos = JSON.parse(cached)
      const filtered = cachedVideos.filter(isValidVideo)
      setVideos(filtered)
      setLoading(false)
      return
    }

    async function fetchAll() {
      let allVideos = []
      let nextPageToken = null

      try {
        do {
          const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`
          const res = await fetch(url)
          const data = await res.json()

          if (data.items) {
            allVideos = allVideos.concat(
              data.items.map(item => ({
                videoId: item.snippet.resourceId.videoId,
                title: item.snippet.title,
              }))
            )
          }
          nextPageToken = data.nextPageToken
        } while (nextPageToken)

        // Filter out private/deleted videos
        const validVideos = allVideos.filter(isValidVideo)

        // Cache the valid videos
        localStorage.setItem(CACHE_KEY(playlistId), JSON.stringify(validVideos))
        setVideos(validVideos)
      } catch (err) {
        console.error("YouTube API error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [playlistId])

  return { videos, loading }
}