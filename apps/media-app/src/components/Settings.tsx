import { useEffect, useState } from "react";
import { api } from "../api";

export function Settings() {
  const [introEnabled, setIntroEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getSettings()
      .then((s) => setIntroEnabled(s.introEnabled))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load settings"));
  }, []);

  async function toggleIntro() {
    if (introEnabled === null) return;
    const next = !introEnabled;
    setIntroEnabled(next); // optimistic
    setError(null);
    try {
      await api.updateSettings(next);
    } catch (err) {
      setIntroEnabled(!next); // revert
      setError(err instanceof Error ? err.message : "Failed to update settings");
    }
  }

  return (
    <div>
      <h3>Settings</h3>
      {error && <p className="error" role="status">{error}</p>}
      {introEnabled === null && !error ? (
        <p>Loading…</p>
      ) : (
        <label className="settings-checkbox">
          <input type="checkbox" checked={introEnabled ?? false} onChange={toggleIntro} />
          Show the intro splash for new sign-ins
        </label>
      )}
    </div>
  );
}
