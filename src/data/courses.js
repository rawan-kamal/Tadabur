// =============================================
// TADABUR - COURSES DATA FILE
// =============================================
// Now syncs progress to Firestore via progressService
// =============================================

import { auth } from "../lib/firebase"
import { saveProgress, saveProgressBatch } from "../lib/progressService"

// Helper: get current user's uid (or null)
function getUid() {
  return auth.currentUser?.uid || null
}


// ─────────────────────────────────────────────
// COURSE 1: مفاتيح التدبر (single playlist)
// ─────────────────────────────────────────────
export const INTRO_COURSE = {
  id: "mafateeh-altadabur",
  title: "مفاتيح التدبر",
  instructor: "فاضل سليمان",
  description: "تعلّم أساسيات التدبر ومفاتيح فهم القرآن الكريم — نقطة البداية لكل رحلة تدبر",
  track: "mafateeh",
  type: "single-playlist",
  playlistId: "PLukAHj56HNKbD2R2ZroUhu7g-mK1S6CrW",
  titleCleanup: ["فاضل سليمان", "من دورة مفاتح التدبر", "|"],
}


// ─────────────────────────────────────────────
// COURSE 2: تدبّر القرآن كاملاً (per-surah)
// ─────────────────────────────────────────────
export const FULL_QURAN_SURAHS = [
  { number: 1,   name: "سورة الفاتحة",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKaDBUhV5NDsL8cp-lhbIWY6",  videoCount: 7  },
  { number: 2,   name: "سورة البقرة",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZEbY6eLwSnLEe3aLj_6XLI",  videoCount: 90 },
  { number: 3,   name: "سورة آل عمران",   playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKbihmsi8Q2Ag5AwqnIc9rM1",  videoCount: 56 },
  { number: 4,   name: "سورة النساء",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZY5swarKIstifWY0wf5V_b",  videoCount: 61 },
  { number: 5,   name: "سورة المائدة",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKaKxiF3jdiNAeVA6tM3KoH8",  videoCount: 40 },
  { number: 6,   name: "سورة الأنعام",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYr73jQFHGrHnZpTdAGPpYN",  videoCount: 46 },
  { number: 7,   name: "سورة الأعراف",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZ1WsJ3hrpyoFPu0O1Q2p0a",  videoCount: 32 },
  { number: 8,   name: "سورة الأنفال",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZ2ZTTm43_VoXpZIYeG7KKe",  videoCount: 23 },
  { number: 9,   name: "سورة التوبة",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKag33yK1sNYl--9gPdhLiqS",  videoCount: 33 },
  { number: 10,  name: "سورة يونس",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZ_wDAMf7ysen_QBS_ffQN5",  videoCount: 28 },
  { number: 11,  name: "سورة هود",        playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKb4EnPhhLVYjK4Gk3EIuVs9",  videoCount: 21 },
  { number: 12,  name: "سورة يوسف",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKY5P7048h0UYJCtbpOV37qc",  videoCount: 17 },
  { number: 13,  name: "سورة الرعد",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKa8goW6Ehd7JcF_TnCo0AAg",  videoCount: 13 },
  { number: 14,  name: "سورة إبراهيم",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKa3Qr-_dnHeKe67n-c9Igfi",  videoCount: 9  },
  { number: 15,  name: "سورة الحجر",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYPaAQjlk3NVr7y11KZ4ACq",  videoCount: 11 },
  { number: 16,  name: "سورة النحل",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKan5Fv62SnvIlOHmtolkbsv",  videoCount: 23 },
  { number: 17,  name: "سورة الإسراء",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKbHTruu02L7Neci58LmnqsT",  videoCount: 20 },
  { number: 18,  name: "سورة الكهف",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZ4hBcmkboiSgBF14yFoE2H",  videoCount: 15 },
  { number: 19,  name: "سورة مريم",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZbgQ1crhiZx3XjIgoI9X6Y",  videoCount: 10 },
  { number: 20,  name: "سورة طه",         playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZjvGqtHTkyKTSBt-n1T9Bj",  videoCount: 17 },
  { number: 21,  name: "سورة الأنبياء",   playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYKBLEnvHDK6crnG0DVBg7b",  videoCount: 15 },
  { number: 22,  name: "سورة الحج",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYGcfZerFtP6Csdcagz94am",  videoCount: 13 },
  { number: 23,  name: "سورة المؤمنون",   playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKb1tp6TX_b1mMvA5OsDT0Ej",  videoCount: 13 },
  { number: 24,  name: "سورة النور",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKaLNgkkZO193vWL5x85bbF9",  videoCount: 16 },
  { number: 25,  name: "سورة الفرقان",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKbfNwnl6RseepMJfxPdbRwu",  videoCount: 14 },
  { number: 26,  name: "سورة الشعراء",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYYF01SQdutB88JH7kHOj2O",  videoCount: 11 },
  { number: 27,  name: "سورة النمل",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKaKRsu0-ymQ0e70cD3VhoXl",  videoCount: 11 },
  { number: 28,  name: "سورة القصص",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKbK83Qe7okZ1GrNqqdQrAcI",  videoCount: 11 },
  { number: 29,  name: "سورة العنكبوت",   playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZcqcTgrhumyOJc2H2DXgXq",  videoCount: 10 },
  { number: 30,  name: "سورة الروم",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKbWiDsm7AQmgCdiuCPkgL5Z",  videoCount: 10 },
  { number: 31,  name: "سورة لقمان",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKa2VZSmTTtmwzLs_i4cELhN",  videoCount: 7  },
  { number: 32,  name: "سورة السجدة",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZDACCR69ZwWdVpr4X7nFyv",  videoCount: 6  },
  { number: 33,  name: "سورة الأحزاب",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZSvAGUr6E-vOLBqQMmwxo-",  videoCount: 18 },
  { number: 34,  name: "سورة سبأ",        playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKY3St-FZk4y2eUPaBB0NWe7",  videoCount: 9  },
  { number: 35,  name: "سورة فاطر",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKY8rrVfvnvcrbLpU73PyNhx",  videoCount: 9  },
  { number: 36,  name: "سورة يس",         playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZMgTH5TFrvWUJjfs4KJtAT",  videoCount: 10 },
  { number: 37,  name: "سورة الصافات",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZ699ZrII12MSdFVXxmeojM",  videoCount: 13 },
  { number: 38,  name: "سورة ص",          playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKa6_OxLEcioaWkM3KF-uYwa",  videoCount: 8  },
  { number: 39,  name: "سورة الزمر",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZy_xXTY52jdLC-PmX06NC1",  videoCount: 12 },
  { number: 40,  name: "سورة غافر",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKaE4JK1vu_k0hGF2C8q8qn3",  videoCount: 12 },
  { number: 41,  name: "سورة فصلت",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYDtvOGPsMASkvm9YhvQnhk",  videoCount: 11 },
  { number: 42,  name: "سورة الشورى",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYdh6WPrljrIWZrcv69yk_r",  videoCount: 13 },
  { number: 43,  name: "سورة الزخرف",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYSS6A02oN9AZuvHJ2-zZyz",  videoCount: 13 },
  { number: 44,  name: "سورة الدخان",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKafVf5e97ZyEBFegGPe0aEY",  videoCount: 7  },
  { number: 45,  name: "سورة الجاثية",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZm6iEQ2k7G_R9a-r0g8b4y",  videoCount: 6  },
  { number: 46,  name: "سورة الأحقاف",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKaTvUp9FrjQbz92H--KaEDT",  videoCount: 7  },
  { number: 47,  name: "سورة محمد",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYF89Pwdl8QwL3B8rs8jnnp",  videoCount: 8  },
  { number: 48,  name: "سورة الفتح",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKairReGHrCBl76Q9cI6nOvN",  videoCount: 8  },
  { number: 49,  name: "سورة الحجرات",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKaLqmr9JkIYgpAuecpTJGDN",  videoCount: 6  },
  { number: 50,  name: "سورة ق",          playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKbqVWDUZhZeH_1oQg6WACAb",  videoCount: 8  },
  { number: 51,  name: "سورة الذاريات",   playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKY6Hv47U6e9Fwp-DJNLQkeC",  videoCount: 6  },
  { number: 52,  name: "سورة الطور",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYjrMiJzxsNjOgN5Ou9aRjz",  videoCount: 5  },
  { number: 53,  name: "سورة النجم",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKaJHg4g7H39wUcjcZXwFgx5",  videoCount: 4  },
  { number: 54,  name: "سورة القمر",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYrq5bEEce3cNd91rFcWLM5",  videoCount: 5  },
  { number: 55,  name: "سورة الرحمن",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYbUUR64pojJlMaplg6ysjU",  videoCount: 5  },
  { number: 56,  name: "سورة الواقعة",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZB5Go_lfcbDaXf_Telntcq",  videoCount: 4  },
  { number: 57,  name: "سورة الحديد",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKakGpHYm6QjQgHv3fMhftIR",  videoCount: 4  },
  { number: 58,  name: "سورة المجادلة",   playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYAHo3uaxc2HH4HWRcTRFRw",  videoCount: 4  },
  { number: 59,  name: "سورة الحشر",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZAMz8RNNRdEhbJjyYcmGAW",  videoCount: 4  },
  { number: 60,  name: "سورة الممتحنة",   playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKa_UOdyYmvdS9vc3hhfKfho",  videoCount: 3  },
  { number: 61,  name: "سورة الصف",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZK6Hi4D8vm7fZTJTlcyZMr",  videoCount: 3  },
  { number: 62,  name: "سورة الجمعة",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4uVD_rlOBZvGC4Wf_GTPyPP",  videoCount: 2  },
  { number: 63,  name: "سورة المنافقون",  playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZZVyHGOM-4mTG5M5tPtYgD",  videoCount: 2  },
  { number: 64,  name: "سورة التغابن",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZXCrTKtW5lqcTMwYYu3Ce3",  videoCount: 3  },
  { number: 65,  name: "سورة الطلاق",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZHQv1Z28wbb1Wo9IB3erzV",  videoCount: 3  },
  { number: 66,  name: "سورة التحريم",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKbLOOTvj5phifhdYQdYaOAI",  videoCount: 3  },
  { number: 67,  name: "سورة الملك",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKb5qxUI7dj2S_oxouvm5gus",  videoCount: 4  },
  { number: 68,  name: "سورة القلم",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZkc5KF3H1efR-cjTgECxM3",  videoCount: 3  },
  { number: 69,  name: "سورة الحاقة",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKbvHTnGOosr3832e1PG0n_-",  videoCount: 3  },
  { number: 70,  name: "سورة المعارج",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZRe5RNTuT295yhLXgfDYKc",  videoCount: 2  },
  { number: 71,  name: "سورة نوح",        playlistUrl: "https://www.youtube-nocookie.com/embed/6uDbhHdlzho?si=MxhKY4RkfTE3Nqf4",                       videoCount: 1  },
  { number: 72,  name: "سورة الجن",       playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKbKgBFX6dvhNo2e0giC1HKA",  videoCount: 4  },
  { number: 73,  name: "سورة المزمل",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKZuFcPSlccBpXc6DDHgIH3u",  videoCount: 2  },
  { number: 74,  name: "سورة المدثر",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLukAHj56HNKYwYp3vy64PfpIMoRcPgLls",  videoCount: 3  },
  { number: 75,  name: "سورة القيامة",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4tCfMJ3lSy_c8MOhRFWPWcG",  videoCount: 2  },
  { number: 76,  name: "سورة الإنسان",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4sfohSZSWXhP47-ceukkryx",  videoCount: 3  },
  { number: 77,  name: "سورة المرسلات",   playlistUrl: "https://www.youtube-nocookie.com/embed/6XHNV7kGuaE?si=4z9gMavjYdoBiIHZ",                      videoCount: 1  },
  { number: 78,  name: "سورة النبأ",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4uz9UABxhuqG2bRE295vAOh",  videoCount: 2  },
  { number: 79,  name: "سورة النازعات",   playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4vSI1t20uOwsh3D9ik1KJ53",  videoCount: 3  },
  { number: 80,  name: "سورة عبس",        playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4upxx3Z9q0iNJLltS9ZBAey",  videoCount: 2  },
  { number: 81,  name: "سورة التكوير",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4sXBzBDfPMm2iwCWIcZJmqT",  videoCount: 2  },
  { number: 82,  name: "سورة الإنفطار",   playlistUrl: "https://www.youtube-nocookie.com/embed/pARW36XSwGU?si=kE-prBw4s8-JGwLn",                      videoCount: 1  },
  { number: 83,  name: "سورة المطففين",   playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4u5Vj4e8jrea86UypafYIIh",  videoCount: 2  },
  { number: 84,  name: "سورة الإنشقاق",   playlistUrl: "https://www.youtube-nocookie.com/embed/_SoaKdUj828?si=kVt_pV7WqizLZ0b_",                      videoCount: 1  },
  { number: 85,  name: "سورة البروج",     playlistUrl: "https://www.youtube-nocookie.com/embed/MC-QvrkoSw?si=7yNPydWdUxtUP5us",                        videoCount: 1  },
  { number: 86,  name: "سورة الطارق",     playlistUrl: "https://www.youtube-nocookie.com/embed/cpfSrBI5Wy0?si=JWZGlr0KqqCXm9XS",                      videoCount: 1  },
  { number: 87,  name: "سورة الأعلى",     playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4umwCRYRlIB3IUIMWe3EDqL",  videoCount: 2  },
  { number: 88,  name: "سورة الغاشية",    playlistUrl: "https://www.youtube-nocookie.com/embed/DRc3znlhXKg?si=rz9MWZUkclkX3nuO",                      videoCount: 1  },
  { number: 89,  name: "سورة الفجر",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4tyjXMo3TKVjDux2KxEu4_3",  videoCount: 2  },
  { number: 90,  name: "سورة البلد",      playlistUrl: "https://www.youtube-nocookie.com/embed/8b1BthGBhnA?si=Tz-cKnwzx2sZ4w9r",                      videoCount: 1  },
  { number: 91,  name: "سورة الشمس",      playlistUrl: "https://www.youtube-nocookie.com/embed/UB-yFvpttIQ?si=i5g8i6_y9jRmWasN",                      videoCount: 1  },
  { number: 92,  name: "سورة الليل",      playlistUrl: "https://www.youtube-nocookie.com/embed/oF0VDreA-1A?si=EEXcfLcCD_E-lf-i",                      videoCount: 1  },
  { number: 93,  name: "سورة الضحى",      playlistUrl: "https://www.youtube-nocookie.com/embed/zsPr3vaZ3NE?si=BtP2T-EV0IW306uU",                      videoCount: 1  },
  { number: 94,  name: "سورة الشرح",      playlistUrl: "https://www.youtube-nocookie.com/embed/KMZn6NC1BJQ?si=KhAAHXYRxFWDwby3",                      videoCount: 1  },
  { number: 95,  name: "سورة التين",      playlistUrl: "https://www.youtube-nocookie.com/embed/vpuBaVR5Dx0?si=lssmY7vicHz0iADG",                      videoCount: 1  },
  { number: 96,  name: "سورة العلق",      playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4v-m5GCL7VTmm9ErydzXwrk",  videoCount: 2  },
  { number: 97,  name: "سورة القدر",      playlistUrl: "https://www.youtube-nocookie.com/embed/YQE_PntLHro?si=L2_X0cvDZ7Cbd8uD",                      videoCount: 1  },
  { number: 98,  name: "سورة البينة",     playlistUrl: "https://www.youtube-nocookie.com/embed/UlHM-AdiP_A?si=k18Ws49RUBcmXx2E",                      videoCount: 1  },
  { number: 99,  name: "سورة الزلزلة",    playlistUrl: "https://www.youtube-nocookie.com/embed/mmYP0bM9VgQ?si=HY849kb0B5CEZ8rJ",                      videoCount: 1  },
  { number: 100, name: "سورة العاديات",   playlistUrl: "https://www.youtube-nocookie.com/embed/6rmErVcdxtc?si=FT1deAF3c1bTCmHy",                      videoCount: 1  },
  { number: 101, name: "سورة القارعة",    playlistUrl: "https://www.youtube-nocookie.com/embed/guyrZUih_k?si=KTrjJKRDXHYF4MxI",                       videoCount: 1  },
  { number: 102, name: "سورة التكاثر",    playlistUrl: "https://www.youtube-nocookie.com/embed/2wHpFcsvf_w?si=8bRIjwJS459a2lMm",                      videoCount: 1  },
  { number: 103, name: "سورة العصر",      playlistUrl: "https://www.youtube-nocookie.com/embed/JIXmdPt2F78?si=FWbF5loG0P2bjnB0",                      videoCount: 1  },
  { number: 104, name: "سورة الهمزة",     playlistUrl: "https://www.youtube-nocookie.com/embed/LI6WGpl2gaU?si=AzGFGRlQryImZ27c",                      videoCount: 1  },
  { number: 105, name: "سورة الفيل",      playlistUrl: "https://www.youtube-nocookie.com/embed/xMsUogmwKrk?si=MKSJDYOzwltKcqNq",                      videoCount: 1  },
  { number: 106, name: "سورة قريش",       playlistUrl: "https://www.youtube-nocookie.com/embed/8KBNa6jYRr4?si=-1-TutWuy6pY92RD",                      videoCount: 1  },
  { number: 107, name: "سورة الماعون",    playlistUrl: "https://www.youtube-nocookie.com/embed/CdfXtWttpq8?si=uhwzMh40B5jCeQdM",                      videoCount: 1  },
  { number: 108, name: "سورة الكوثر",     playlistUrl: "https://www.youtube-nocookie.com/embed/YEBwLPFFa5Y?si=XB4wBZFwCQiapdRj",                      videoCount: 1  },
  { number: 109, name: "سورة الكافرون",   playlistUrl: "https://www.youtube-nocookie.com/embed/vQxIy3du5No?si=iBrt4aRSbdR0dFh1",                      videoCount: 1  },
  { number: 110, name: "سورة النصر",      playlistUrl: "https://www.youtube-nocookie.com/embed/QNlL1fKlxN4?si=OItHKn-Yz5QmFPrE",                      videoCount: 1  },
  { number: 111, name: "سورة المسد",      playlistUrl: "https://www.youtube-nocookie.com/embed/-3MSklGdVDA?si=-f3RYUssIEZZ9QWW",                      videoCount: 1  },
  { number: 112, name: "سورة الإخلاص",    playlistUrl: "https://www.youtube-nocookie.com/embed/videoseries?list=PLexA2Jszbl4tcmQ9jw3rpO8U2MXZ1nPhI",  videoCount: 2  },
  { number: 113, name: "سورة الفلق",      playlistUrl: "https://www.youtube-nocookie.com/embed/N9mVySIo5Zs?si=2Z36tC3gb1sH-jwY",                      videoCount: 1  },
  { number: 114, name: "سورة الناس",      playlistUrl: "https://www.youtube-nocookie.com/embed/xAfKtJ13IMo?si=Ai0vRe0jBcadRUF0",                      videoCount: 1  },
]

export const FULL_QURAN_COURSE = {
  id: "fadel-soliman-full-quran",
  title: "تدبّر القرآن كاملاً",
  instructor: "فاضل سليمان",
  description: "رحلة شاملة لتدبر القرآن الكريم كاملاً سورة بسورة مع الشيخ فاضل سليمان",
  track: "full-quran",
  type: "per-surah",
  totalLessons: FULL_QURAN_SURAHS.length,
  totalVideos: FULL_QURAN_SURAHS.reduce((acc, s) => acc + s.videoCount, 0),
  surahs: FULL_QURAN_SURAHS,
}


// ─────────────────────────────────────────────
// ALL COURSES LIST
// ─────────────────────────────────────────────
export const courses = [
  INTRO_COURSE,
  FULL_QURAN_COURSE,
]


// =============================================
// PROGRESS HELPERS
// =============================================
// Reads use localStorage (instant, synced on login)
// Writes save to localStorage AND Firestore (via progressService)
// =============================================

// --- For single-playlist courses ---
export function isVideoWatched_Single(courseId, videoId) {
  return localStorage.getItem(`watch_${courseId}_${videoId}`) === "true"
}

export function markVideoWatched_Single(courseId, videoId) {
  const key = `watch_${courseId}_${videoId}`
  localStorage.setItem(key, "true")
  // Fire-and-forget cloud sync
  saveProgress(getUid(), key, "true")
}

export function getSingleCourseProgress(courseId, allVideoIds) {
  const watched = allVideoIds.filter(id => isVideoWatched_Single(courseId, id)).length
  return {
    watched,
    total: allVideoIds.length,
    percent: allVideoIds.length > 0 ? Math.round((watched / allVideoIds.length) * 100) : 0
  }
}

// --- For per-surah courses ---
export function isEpisodeWatched(courseId, surahNumber, episodeIndex) {
  return localStorage.getItem(`watch_${courseId}_${surahNumber}_${episodeIndex}`) === "true"
}

export function markEpisodeWatched(courseId, surahNumber, episodeIndex) {
  const key = `watch_${courseId}_${surahNumber}_${episodeIndex}`
  localStorage.setItem(key, "true")
  saveProgress(getUid(), key, "true")
}

export function isSurahDone(courseId, surahNumber) {
  return localStorage.getItem(`surahDone_${courseId}_${surahNumber}`) === "true"
}

export function markSurahDone(courseId, surahNumber) {
  const key = `surahDone_${courseId}_${surahNumber}`
  localStorage.setItem(key, "true")
  saveProgress(getUid(), key, "true")
}

export function getSurahProgress(courseId, surahNumber, videoCount) {
  let watched = 0
  for (let i = 1; i <= videoCount; i++) {
    if (isEpisodeWatched(courseId, surahNumber, i)) watched++
  }
  return {
    watched,
    total: videoCount,
    percent: videoCount > 0 ? Math.round((watched / videoCount) * 100) : 0
  }
}

export function getFullQuranProgress(courseId, surahs) {
  const done = surahs.filter(s => isSurahDone(courseId, s.number)).length
  return {
    doneSurahs: done,
    totalSurahs: surahs.length,
    percent: Math.round((done / surahs.length) * 100)
  }
}

export const PLAYLIST_COURSES = [
  {
    id: "hedayat-quran",
    title: "من هدايات القرآن في سوره وأجزائه",
    instructor: "الشيخ عمرو الشرقاوي",
    description: "رحلة مع هدايات القرآن الكريم في سوره وأجزائه مع الشيخ عمرو الشرقاوي",
    playlistId: "PLnpYU8_AiEPfDgV7O_cvduDPZNH8pJb7n",
  },
  {
    id: "tafseer-amma",
    title: "تفسير جزء عَمَّ",
    instructor: "د. أحمد عبد المنعم",
    description: "تفسير سور جزء عمّ مع الدكتور أحمد عبد المنعم",
    playlistId: "PLnpYU8_AiEPdZtOcZemEHETeOjWakJpKE",
  },
  {
    id: "tadabur-tabarak",
    title: "تدبر جزء تبارك",
    instructor: "شريف علي",
    description: "وقفات تدبرية مع سور جزء تبارك مع الشيخ شريف علي",
    playlistId: "PL_ZXIiZMp3ML0LOkPZWlwALddx2VZuVzv",
  },
  {
    id: "majaless-quran",
    title: "مجالس القرآن - الجزء ٢٧ و٢٩",
    instructor: "أحمد عامر",
    description: "مجالس قرآنية في تدبر سور الجزء السابع والعشرين والتاسع والعشرين",
    playlistId: "PLSSxr3Rf2_X0LhahU5RFyX87dKBAjIkZj",
  },
  {
    id: "playlist-5",
    title: "مجالس القرآن - تدبر سورة إبراهيم",
    instructor: "أحمد عامر",
    description: "مجالس قرآنية في تدبر سور إبراهيم",
    playlistId: "PLSSxr3Rf2_X2gA3fxqlTB3F7RQoj5vOcX",
  },
  {
    id: "playlist-6",
    title: "مجالس القرآن - تدبر سورة فاطر",
    instructor: "أحمد عامر",
    description: "مجالس قرآنية في تدبر سور فاطر",
    playlistId: "PLSSxr3Rf2_X3pttwSo_2ES1YgEzqdSzgn",
  },
]