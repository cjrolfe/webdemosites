const INTRO_SEEN_KEY = "swordthain_intro_seen";

/** True once this browser has been shown the splash intro (persistent, not per-session — see Splash.tsx). */
export function hasSeenIntro(): boolean {
  return localStorage.getItem(INTRO_SEEN_KEY) === "1";
}

export function markIntroSeen(): void {
  localStorage.setItem(INTRO_SEEN_KEY, "1");
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
