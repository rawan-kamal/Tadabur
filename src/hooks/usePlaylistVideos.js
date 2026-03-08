import { useState, useEffect } from "react"

const API_KEY = "AIzaSyCGrkfBM9UH6tExzJVBDDRghp8avEBnnqE"
const CACHE_KEY = (playlistId) => `yt_cache_${playlistId}`

export function usePlaylistVideos(playlistId) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!playlistId) return

    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY(playlistId))
    if (cached) {
      setVideos(JSON.parse(cached))
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

        // Cache it so we don't re-fetch every time
        localStorage.setItem(CACHE_KEY(playlistId), JSON.stringify(allVideos))
        setVideos(allVideos)
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