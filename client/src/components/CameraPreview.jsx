import { useEffect, useRef, useState } from "react";

export default function CameraPreview({ enabled, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!enabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setActive(false);
      return;
    }

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError(true);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setActive(true);
        setError(false);
      } catch (err) {
        // Fail silently and gracefully on permission denied / camera unavailable
        console.warn("Camera preview not available or permission denied:", err);
        if (isMounted) {
          setError(true);
          setActive(false);
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [enabled]);

  if (!enabled || error || !active) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 bg-stamp-navy ${
        minimized ? "w-36 h-24" : "w-60 sm:w-72 h-44 sm:h-52"
      }`}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-2.5 py-1.5 bg-black/50 backdrop-blur-xs text-white text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="tracking-wider uppercase font-bold text-white/90">
            CAM PREVIEW
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMinimized(!minimized)}
            className="px-1.5 py-0.5 rounded hover:bg-surface/20 text-white/80"
            title={minimized ? "Expand" : "Minimize"}
          >
            {minimized ? "◻" : "—"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-1.5 py-0.5 rounded hover:bg-surface/20 text-white/80"
              title="Close camera"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Video Feed (Mirrored selfie view, muted) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />
    </div>
  );
}
