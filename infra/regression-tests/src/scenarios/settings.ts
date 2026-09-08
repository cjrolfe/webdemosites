import type { Api } from "../api.js";
import { assert } from "../assert.js";

/**
 * The splash intro's admin kill switch (GET/PATCH /settings). Only checks
 * the Owner path — this suite has just one provisioned test account, the
 * Owner-privileged fixed-OTP one (see auth.ts), and no Member test account
 * to exercise the PATCH-as-Member-should-403 case against the real,
 * signature-verifying API. That path is covered by code review of
 * settings.ts's isOwner() check instead (the same pattern every other
 * Owner-only route in this API already uses).
 */
export async function run(api: Api): Promise<void> {
  const original = await api.getSettings();
  assert(typeof original.introEnabled === "boolean", "GET /settings should return a boolean introEnabled");

  try {
    const flipped = !original.introEnabled;
    const updateResult = await api.updateSettings(flipped);
    assert(updateResult.introEnabled === flipped, "PATCH /settings should echo the new value");

    const reread = await api.getSettings();
    assert(reread.introEnabled === flipped, "a follow-up GET should reflect the PATCH");
  } finally {
    // This is a global setting shared by every real sign-in — always leave
    // it exactly as found, regardless of where an assertion above failed.
    await api.updateSettings(original.introEnabled);
  }
}
