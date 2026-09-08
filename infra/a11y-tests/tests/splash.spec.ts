import { test, expect } from "./fixtures.js";
import { assertNoWcagViolations } from "../src/axe.js";
import { API_URL } from "../src/config.js";
import type { Page } from "@playwright/test";
import type { Session } from "../src/auth.js";

// Deliberately doesn't use seedSession() from src/session-seed.ts — that
// helper also seeds swordthain_intro_seen=1 (so every *other* spec skips
// straight past the splash), but these tests specifically want the real
// first-time-visitor state. Same STORAGE_KEY as apps/media-app/src/auth.ts
// and session-seed.ts.
async function seedSessionOnly(page: Page, session: Session): Promise<void> {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    ["swordthain_session", JSON.stringify(session)]
  );
}

async function setIntroEnabled(idToken: string, introEnabled: boolean): Promise<void> {
  await fetch(`${API_URL}/settings`, {
    method: "PATCH",
    headers: { "content-type": "application/json", authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ introEnabled }),
  });
}

test.describe("Splash intro", () => {
  test("prompt phase is keyboard-reachable with zero WCAG violations", async ({ page, ownerSession }) => {
    await seedSessionOnly(page, ownerSession);
    await page.goto("/");
    const enter = page.getByRole("button", { name: "Enter" });
    await expect(enter).toBeVisible();
    await expect(enter).toBeFocused();
    await expect(page.getByRole("button", { name: "Skip" })).toBeVisible();
    await assertNoWcagViolations(page, "Splash — prompt phase");
  });

  test("Escape dismisses it, reveals the app shell, and doesn't replay on reload", async ({ page, ownerSession }) => {
    await seedSessionOnly(page, ownerSession);
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Enter" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: "Swordthain Admin" })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Swordthain Admin" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Enter" })).toHaveCount(0);
  });

  test("Skip control dismisses it too", async ({ page, ownerSession }) => {
    await seedSessionOnly(page, ownerSession);
    await page.goto("/");
    await page.getByRole("button", { name: "Skip" }).click();
    await expect(page.getByRole("heading", { name: "Swordthain Admin" })).toBeVisible();
  });

  test("prefers-reduced-motion skips it entirely, with no network request for it", async ({ page, ownerSession }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await seedSessionOnly(page, ownerSession);
    const introRequests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/intro.mp4") || req.url().includes("/intro-poster.jpg")) introRequests.push(req.url());
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Swordthain Admin" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Enter" })).toHaveCount(0);
    expect(introRequests).toEqual([]);
  });

  test("admin kill switch: disabling it suppresses the splash for a fresh sign-in", async ({ page, ownerSession }) => {
    await setIntroEnabled(ownerSession.idToken, false);
    try {
      await seedSessionOnly(page, ownerSession);
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Swordthain Admin" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Enter" })).toHaveCount(0);
    } finally {
      // Reset — this is a global setting shared by every other test/user.
      await setIntroEnabled(ownerSession.idToken, true);
    }
  });
});
