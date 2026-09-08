import { useEffect, useRef, useState } from "react";
import { markIntroSeen } from "../intro";

type Phase = "prompt" | "playing" | "fading";
const FADE_MS = 250;

/**
 * One-time studio-ident splash, shown right after sign-in (see App.tsx for
 * why it's post-login, not pre-Login). Two real phases plus a brief fade:
 * "prompt" shows the poster frame with a real, crisp HTML wordmark stamped
 * over the crossguard (never baked into the AI-generated video/image — see
 * the plan for why), "playing" mounts the actual <video> only once a click
 * has given us a user gesture to autoplay with sound, "fading" is a short
 * opacity transition out before unmounting, so the app shell underneath
 * doesn't just pop into view.
 */
export function Splash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("prompt");
  const enterRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // "Seen" means "we decided to show it," not "watched to the end" — a
    // refresh mid-playback should never replay it.
    markIntroSeen();
    enterRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") finish();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    // Imperative play(), triggered by the click that switched to this
    // phase — the reliable way to get gesture-credited unmuted autoplay
    // (same trick Lightbox.tsx already relies on for its own <video>).
    videoRef.current?.play().catch(finish); // blocked somehow — don't strand the user on a frozen frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function finish() {
    setPhase("fading");
    setTimeout(onDone, FADE_MS);
  }

  return (
    <div className={`splash${phase === "fading" ? " splash-fading" : ""}`} role="dialog" aria-modal="true" aria-label="Swordthain intro">
      {phase === "prompt" && (
        <div className="splash-prompt" style={{ backgroundImage: "url(/intro-poster.jpg)" }}>
          <h1 className="splash-title">Swordthain</h1>
          <button ref={enterRef} className="splash-enter" onClick={() => setPhase("playing")}>
            Enter
          </button>
        </div>
      )}
      {phase !== "prompt" && (
        <video ref={videoRef} className="splash-video" src="/intro.mp4" playsInline onEnded={finish} />
      )}
      <button className="splash-skip" onClick={finish}>
        Skip
      </button>
    </div>
  );
}
