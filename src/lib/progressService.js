// ══════════════════════════════════════════════════════
// PROGRESS SERVICE
// Syncs user progress between localStorage (fast) and Firestore (cloud)
// ══════════════════════════════════════════════════════

import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

// ─────────────────────────────────────────────────────
// KEYS — all progress keys start with these prefixes
// ─────────────────────────────────────────────────────
const PROGRESS_PREFIXES = ["watch_", "surahDone_"]

function isProgressKey(key) {
  return PROGRESS_PREFIXES.some(p => key.startsWith(p))
}

// ─────────────────────────────────────────────────────
// READ all progress from localStorage
// ─────────────────────────────────────────────────────
function getAllLocalProgress() {
  const progress = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (isProgressKey(key)) {
      progress[key] = localStorage.getItem(key)
    }
  }
  return progress
}

// ─────────────────────────────────────────────────────
// WRITE progress map to localStorage
// ─────────────────────────────────────────────────────
function setLocalProgress(progressMap) {
  Object.entries(progressMap).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })
}

// ─────────────────────────────────────────────────────
// FIRESTORE — document path: /users/{uid}
// ─────────────────────────────────────────────────────
function getUserDocRef(uid) {
  return doc(db, "users", uid)
}

// ─────────────────────────────────────────────────────
// LOAD from Firestore + merge with localStorage
// Called once on login
// ─────────────────────────────────────────────────────
export async function loadCloudProgress(uid) {
  try {
    const ref = getUserDocRef(uid)
    const snap = await getDoc(ref)

    const localProgress = getAllLocalProgress()

    if (snap.exists()) {
      const cloudProgress = snap.data().progress || {}

      // Merge: cloud wins for existing keys, local adds new keys
      const merged = { ...localProgress, ...cloudProgress }

      // Also add any local-only keys to the merged set
      Object.keys(localProgress).forEach(key => {
        if (!(key in merged)) {
          merged[key] = localProgress[key]
        }
      })

      // Write merged to localStorage
      setLocalProgress(merged)

      // Save merged back to cloud (includes any new local progress)
      await setDoc(ref, { progress: merged }, { merge: true })

      console.log(`[Progress] Synced ${Object.keys(merged).length} items from cloud`)
      return merged
    } else {
      // First time user — upload local progress to cloud
      if (Object.keys(localProgress).length > 0) {
        await setDoc(ref, { progress: localProgress }, { merge: true })
        console.log(`[Progress] Uploaded ${Object.keys(localProgress).length} local items to cloud`)
      }
      return localProgress
    }
  } catch (err) {
    console.error("[Progress] Cloud sync failed, using local only:", err)
    return getAllLocalProgress()
  }
}

// ─────────────────────────────────────────────────────
// SAVE a single progress key
// Called when user marks a video as watched
// ─────────────────────────────────────────────────────
export async function saveProgress(uid, key, value) {
  // Always save to localStorage first (instant)
  localStorage.setItem(key, value)

  // Then sync to cloud (background)
  if (!uid) return

  try {
    const ref = getUserDocRef(uid)
    await setDoc(ref, {
      progress: { [key]: value }
    }, { merge: true })
  } catch (err) {
    console.error("[Progress] Failed to save to cloud:", err)
    // localStorage still has the data, so the user won't lose progress
  }
}

// ─────────────────────────────────────────────────────
// SAVE multiple progress keys at once
// ─────────────────────────────────────────────────────
export async function saveProgressBatch(uid, updates) {
  // Save all to localStorage
  Object.entries(updates).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })

  // Sync to cloud
  if (!uid) return

  try {
    const ref = getUserDocRef(uid)
    await setDoc(ref, { progress: updates }, { merge: true })
  } catch (err) {
    console.error("[Progress] Batch save to cloud failed:", err)
  }
}

// ─────────────────────────────────────────────────────
// SAVE user profile info (name, email, photo)
// Called on login
// ─────────────────────────────────────────────────────
export async function saveUserProfile(uid, user) {
  if (!uid || !user) return

  try {
    const ref = getUserDocRef(uid)
    await setDoc(ref, {
      profile: {
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        lastLogin: new Date().toISOString(),
      }
    }, { merge: true })
  } catch (err) {
    console.error("[Progress] Failed to save profile:", err)
  }
}