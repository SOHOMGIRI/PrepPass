import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, AlertCircle, RefreshCw } from "lucide-react";

export default function CameraPreview({ enabled, onClose }) {
  const videoElementRef = useRef(null);
  const streamRef = useRef(null);
  const [active, setActive] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState("");
  const [minimized, setMinimized] = useState(false);

  // Attach stream whenever video element is available in DOM
  const setVideoRef = useCallback((node) => {
    videoElementRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch((err) => console.warn("[CAMERA AUTO-PLAY]", err));
    }
  }, []);

  const startCamera = useCallback(async () => {
    setConnecting(true);
    setError("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Webcam access is not supported by your browser environment.");
      setConnecting(false);
      return;
    }

    let stream = null;
    try {
      // Primary attempt: standard user-facing constraints
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });
    } catch (constraintErr) {
      console.warn("[CAMERA CONSTRAINTS FALLBACK] Retrying with generic video constraints:", constraintErr);
      try {
        // Fallback attempt: any available video device (USB camera, virtual cam, laptop sensor)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (fallbackErr) {
        console.error("[CAMERA ACCESS ERROR]", fallbackErr);
        if (fallbackErr.name === "NotAllowedError" || fallbackErr.name === "PermissionDeniedError") {
          setError("Camera permission denied. Please allow camera access in your browser address bar.");
        } else if (fallbackErr.name === "NotFoundError" || fallbackErr.name === "DevicesNotFoundError") {
          setError("No video input devices located on this workstation.");
        } else {
          setError("Could not initialize video sensor: " + (fallbackErr.message || "Unknown error"));
        }
        setConnecting(false);
        setActive(false);
        return;
      }
    }

    if (!stream) {
      setConnecting(false);
      return;
    }

    streamRef.current = stream;

    // Attach to video element if already mounted
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = stream;
      videoElementRef.current.play().catch((err) => console.warn("[CAMERA PLAY]", err));
    }

    setActive(true);
    setConnecting(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setActive(false);
      setConnecting(false);
      return;
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [enabled, startCamera]);

  if (!enabled) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 bg-[#14100C] ${
        minimized ? "w-40 h-28" : "w-64 sm:w-76 h-48 sm:h-56"
      }`}
      style={{
        boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(245, 158, 11, 0.2)",
      }}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${active ? "bg-red-500 animate-pulse" : "bg-amber-400"}`} />
          <span className="tracking-wider uppercase font-bold text-white/95">
            {active ? "🔴 CAM PREVIEW" : "CONNECTING..."}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMinimized(!minimized)}
            className="px-1.5 py-0.5 rounded hover:bg-white/20 text-white/90 transition-colors"
            title={minimized ? "Expand preview" : "Minimize preview"}
          >
            {minimized ? "◻" : "—"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-1.5 py-0.5 rounded hover:bg-white/20 text-white/90 transition-colors font-bold"
              title="Close camera"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Camera Loading Overlay */}
      {connecting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#14100C] text-amber-200/80 z-10 p-4 text-center">
          <RefreshCw size={24} className="animate-spin mb-2 text-amber-400" />
          <span className="font-mono text-xs font-semibold">Initializing Sensor…</span>
        </div>
      )}

      {/* Camera Error Overlay */}
      {error && !connecting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#14100C] text-rose-300 z-10 p-4 text-center">
          <AlertCircle size={22} className="mb-1 text-rose-400" />
          <span className="font-mono text-[11px] leading-tight mb-2">{error}</span>
          <button
            type="button"
            onClick={startCamera}
            className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-mono text-[10px] border border-amber-400/40"
          >
            Retry Access
          </button>
        </div>
      )}

      {/* Video Feed (Mirrored selfie view, muted) */}
      <video
        ref={setVideoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={(e) => {
          e.target.play().catch((err) => console.warn("[METADATA PLAY]", err));
          setActive(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "scaleX(-1)" }}
      />
    </div>
  );
}
