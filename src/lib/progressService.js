// ══════════════════════════════════════════════════════
// PROGRESS SERVICE
// Syncs user progress between localStorage (fast) and Firestore (cloud)
// ══════════════════════════════════════════════════════

import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import { deleteUser } from "firebase/auth"
import { db, auth } from "./firebase"

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
// CLEAR local progress
// ─────────────────────────────────────────────────────
export function clearLocalProgress() {
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (isProgressKey(key)) keysToRemove.push(key)
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
  console.log(`[Progress] Cleared ${keysToRemove.length} local progress keys`)
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
// LOAD from Firestore — replaces localStorage with this user's cloud data
// Called once on login
// ─────────────────────────────────────────────────────
export async function loadCloudProgress(uid) {
  try {
    const ref = getUserDocRef(uid)
    const snap = await getDoc(ref)

    // FIX: wipe any leftover progress from a previous account before
    // writing this user's data — prevents cross-account contamination
    clearLocalProgress()

    if (snap.exists()) {
      const cloudProgress = snap.data().progress || {}

      // Write this user's cloud progress to localStorage
      setLocalProgress(cloudProgress)

      console.log(`[Progress] Synced ${Object.keys(cloudProgress).length} items from cloud`)
      return cloudProgress
    } else {
      // First time user — nothing in cloud yet, localStorage is already cleared
      console.log("[Progress] New user, starting fresh")
      return {}
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
  }
}

// ─────────────────────────────────────────────────────
// SAVE multiple progress keys at once
// ─────────────────────────────────────────────────────
export async function saveProgressBatch(uid, updates) {
  Object.entries(updates).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })

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

// ─────────────────────────────────────────────────────
// DELETE user account completely
// Removes: Firestore data + Auth account + Local storage
// ─────────────────────────────────────────────────────
export async function deleteUserAccount(uid) {
  if (!uid) throw new Error("No user ID provided")

  try {
    // 1. Delete Firestore document
    const ref = getUserDocRef(uid)
    await deleteDoc(ref)
    console.log("[Progress] Deleted Firestore document")

    // 2. Delete Firebase Auth account
    const currentUser = auth.currentUser
    if (currentUser && currentUser.uid === uid) {
      await deleteUser(currentUser)
      console.log("[Progress] Deleted Auth account")
    }

    // 3. Clear all local storage
    clearLocalProgress()
    console.log("[Progress] Cleared local storage")

    return { success: true }
  } catch (err) {
    console.error("[Progress] Failed to delete account:", err)
    throw err
  }
}

// ─────────────────────────────────────────────────────
// GET course progress from localStorage (no video IDs needed)
// Scans localStorage for all watch_ keys matching the courseId
// ─────────────────────────────────────────────────────
export function getCourseProgressFromStorage(courseId) {
  const prefix = `watch_${courseId}_`
  let watchedCount = 0
  let totalCount = 0

  // Scan localStorage for all keys matching this course
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      totalCount++
      if (localStorage.getItem(key) === "true") {
        watchedCount++
      }
    }
  }

  return {
    watched: watchedCount,
    total: totalCount,
    percent: totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0
  }
}