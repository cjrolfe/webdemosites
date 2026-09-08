import type { Page } from "@playwright/test";
import type { Session } from "./auth.js";

// Matches apps/media-app/src/auth.ts's STORAGE_KEY exactly — the app reads
// this synchronously on mount (App.tsx's loadSession()) and skips the Login
// screen entirely if it's present and parses as valid JSON. Seeding it via
// addInitScript (runs before any page script, including the app's own)
// means we never touch the live OTP UI at all.
const STORAGE_KEY = "swordthain_session";

// Matches apps/media-app/src/intro.ts's INTRO_SEEN_KEY. Every spec that
// seeds a session wants a ready-to-test authenticated shell, not the
// one-time splash intro sitting in front of it — splash.spec.ts seeds a
// session directly (without this helper) for the cases that actually want
// to exercise the splash itself.
const INTRO_SEEN_KEY = "swordthain_intro_seen";

/** Seeds a session (and suppresses the one-time splash intro) before the app's own scripts run, so it loads already signed in, straight to the authenticated shell. */
export async function seedSession(page: Page, session: Session): Promise<void> {
  await page.addInitScript(
    ([sessionKey, sessionValue, introKey]) => {
      window.localStorage.setItem(sessionKey, sessionValue);
      window.localStorage.setItem(introKey, "1");
    },
    [STORAGE_KEY, JSON.stringify(session), INTRO_SEEN_KEY]
  );
}
