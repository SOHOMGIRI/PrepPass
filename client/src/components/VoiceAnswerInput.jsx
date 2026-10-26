import { useEffect, useRef, useState, useCallback } from "react";
import SpeechTelemetryHUD from "./SpeechTelemetryHUD.jsx";
import { useSpeechProsody } from "../hooks/useSpeechProsody.js";
import { Mic, MicOff, Keyboard, RotateCcw, AlertTriangle, Sparkles } from "lucide-react";

export default function VoiceAnswerInput({
  answer,
  setAnswer,
  busy,
  onSwitchToTyping,
}) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [micError, setMicError] = useState("");

  const handleTranscriptUpdate = useCallback(
    (newText) => {
      setAnswer(newText);
    },
    [setAnswer]
  );

  const prosody = useSpeechProsody({
    isListening,
    onTranscriptUpdate: handleTranscriptUpdate,
  });

  const toggleListening = useCallback(() => {
    setMicError("");
    setIsListening((prev) => !prev);
  }, []);

  return (
    <div className="space-y-4">
      {micError && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 font-mono text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>{micError}</span>
          </div>
          <button
            type="button"
            onClick={() => setMicError("")}
            className="text-amber-800 font-bold ml-2 hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      {/* Voice Control Action Banner */}
      <div className="rounded-2xl border border-[#0A1128]/8 bg-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleListening}
            disabled={busy}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl transition-all shadow-sm ${
              isListening
                ? "bg-red-600 text-white ring-4 ring-red-200 animate-pulse"
                : "bg-[#0A1128] text-[#FDFBF7] hover:bg-[#1E293B] hover:scale-105 active:scale-95"
            }`}
            title={isListening ? "Stop vocal recording" : "Activate acoustic capture"}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} className="text-[#C5A059]" />}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  isListening ? "bg-red-500 animate-ping" : "bg-emerald-500"
                }`}
              />
              <span className="font-heading text-sm text-[#0A1128] font-bold">
                {isListening ? "Acoustic Telemetry Active — Articulate Response" : "Acoustic Sensor Ready"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {isListening
                ? "Live analysis active: WPM cadence, fillers, and prosody being computed."
                : "Select the microphone to initiate real-time spoken assessment."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToTyping && (
            <button
              type="button"
              onClick={onSwitchToTyping}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0A1128]/10 bg-[#FDFBF7] px-3.5 py-2 font-mono text-xs font-semibold text-[#0A1128] hover:bg-white shadow-2xs transition-colors"
            >
              <Keyboard size={14} /> Type Response
            </button>
          )}
          {answer.trim() && (
            <button
              type="button"
              onClick={() => {
                setAnswer("");
                prosody.resetProsody();
              }}
              disabled={busy || isListening}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 font-mono text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-40 transition-colors"
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Real-time Acoustic Fluency Telemetry HUD */}
      <SpeechTelemetryHUD
        wpm={prosody.wpm}
        vocalEnergy={prosody.vocalEnergy}
        fillerCount={prosody.fillerCount}
        detectedFillers={prosody.detectedFillers}
        pauseCount={prosody.pauseCount}
        fluencyScore={prosody.fluencyScore}
        isRecording={isListening}
      />

      {/* Editable Live Transcript Box */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>REAL-TIME TRANSCRIPT & CANDIDATE AUDIT:</span>
          <span className="font-semibold text-navy-900">
            {isListening ? "🎙️ Acoustic capture stream" : "✓ Candidate can polish text before commit"}
          </span>
        </div>

        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            placeholder={
              isListening
                ? "Listening... spoken words will stream here in real-time..."
                : "Candidate transcript will appear here. You can manually refine grammar, formatting, or code snippets before final evaluation..."
            }
            className="w-full rounded-xl border border-[#0A1128]/10 bg-white px-4 py-3.5 text-sm text-[#0A1128] placeholder-slate-400 focus:border-[#C5A059] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 leading-relaxed font-body shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
}
