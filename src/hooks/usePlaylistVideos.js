import { useState, useEffect } from "react"

const API_KEY      = import.meta.env.VITE_YOUTUBE_API_KEY
const CACHE_KEY    = (id) => `yt_cache_${id}`
const CACHE_TS_KEY = (id) => `yt_cache_${id}_ts`
const CACHE_TTL    = 24 * 60 * 60 * 1000 // 24 hours

// ─────────────────────────────────────────────────────
// In-memory cache — lives for the duration of the session.
// Prevents duplicate fetches when multiple components
// mount with the same playlistId.
// ─────────────────────────────────────────────────────
const memoryCache = new Map()  // playlistId → video[]
const inFlight    = new Map()  // playlistId → Promise

// Filter out private/deleted videos
function isValidVideo(video) {
  const title = video.title?.trim().toLowerCase() || ""
  if (!title) return false
  const invalidTitles = [
    "private video",
    "deleted video",
    "vidéo privée",
    "video privado",
    "[private video]",
    "[deleted video]",
  ]
  return !invalidTitles.includes(title)
}

async function fetchPlaylist(playlistId) {
  let allVideos     = []
  let nextPageToken = null

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`
    const res  = await fetch(url)

    if (!res.ok) {
      if (res.status === 403) throw new Error("YouTube API quota exceeded or key is invalid (403)")
      if (res.status === 404) throw new Error(`Playlist not found: ${playlistId} (404)`)
      throw new Error(`YouTube API error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (data.error) {
      throw new Error(`YouTube API: ${data.error.message} (${data.error.code})`)
    }

    if (data.items) {
      allVideos = allVideos.concat(
        data.items.map(item => ({
          videoId: item.snippet?.resourceId?.videoId,
          title:   item.snippet?.title,
        }))
      )
    }

    nextPageToken = data.nextPageToken ?? null
  } while (nextPageToken)

  return allVideos.filter(isValidVideo)
}

export function usePlaylistVideos(playlistId) {
  const [videos, setVideos]   = useState(() => memoryCache.get(playlistId) ?? [])
  const [loading, setLoading] = useState(!memoryCache.has(playlistId))
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!playlistId) return

    // Already in memory — nothing to do
    if (memoryCache.has(playlistId)) {
      setVideos(memoryCache.get(playlistId))
      setLoading(false)
      return
    }

    // Check localStorage cache with TTL
    const cached  = localStorage.getItem(CACHE_KEY(playlistId))
    const cacheTs = localStorage.getItem(CACHE_TS_KEY(playlistId))
    const age     = Date.now() - Number(cacheTs)

    if (cached && cacheTs && age < CACHE_TTL) {
      try {
        const parsed = JSON.parse(cached)
        const valid  = parsed.filter(isValidVideo)
        memoryCache.set(playlistId, valid)
        setVideos(valid)
        setLoading(false)
        return
      } catch {
        localStorage.removeItem(CACHE_KEY(playlistId))
        localStorage.removeItem(CACHE_TS_KEY(playlistId))
      }
    }

    // If a fetch is already in-flight for this playlist, reuse it
    if (!inFlight.has(playlistId)) {
      inFlight.set(playlistId, fetchPlaylist(playlistId).finally(() => {
        inFlight.delete(playlistId)
      }))
    }

    inFlight.get(playlistId)
      .then(validVideos => {
        localStorage.setItem(CACHE_KEY(playlistId), JSON.stringify(validVideos))
        localStorage.setItem(CACHE_TS_KEY(playlistId), String(Date.now()))
        memoryCache.set(playlistId, validVideos)
        setVideos(validVideos)
        setError(null)
      })
      .catch(err => {
        console.error("YouTube API error:", err.message)
        setError(err.message)

        // Fall back to stale localStorage cache if available
        const staleCache = localStorage.getItem(CACHE_KEY(playlistId))
        if (staleCache) {
          try {
            const parsed = JSON.parse(staleCache)
            setVideos(parsed.filter(isValidVideo))
          } catch {
            setVideos([])
          }
        }
      })
      .finally(() => setLoading(false))
  }, [playlistId])

  return { videos, loading, error }
}