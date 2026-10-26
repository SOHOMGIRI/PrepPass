import { useEffect, useState, useCallback, useRef } from "react";
import SpeechTelemetryHUD from "./SpeechTelemetryHUD.jsx";
import { useSpeechProsody } from "../hooks/useSpeechProsody.js";
import { Mic, MicOff, Keyboard, RotateCcw, AlertTriangle, Sparkles, Volume2 } from "lucide-react";

export default function VoiceAnswerInput({
  answer,
  setAnswer,
  busy,
  onSwitchToTyping,
}) {
  const [isListening, setIsListening] = useState(false);
  const answerRef = useRef(answer);

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

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
    setIsListening((prev) => {
      const nextListening = !prev;
      if (nextListening) {
        prosody.setManualBaseText(answerRef.current);
      }
      return nextListening;
    });
  }, [prosody]);

  const displayedError = prosody.micError;

  return (
    <div className="space-y-4">
      {displayedError && (
        <div className="rounded-2xl bg-amber-100/90 border border-amber-300 p-3.5 font-mono text-xs text-amber-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={16} className="text-amber-700 shrink-0" />
            <span>{displayedError}</span>
          </div>
          <button
            type="button"
            onClick={() => prosody.setMicError("")}
            className="text-amber-900 font-bold ml-2 hover:opacity-80 px-2 py-0.5 rounded bg-amber-200/50"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Voice Control Action Banner (Warm Champagne Glass) */}
      <div 
        className="rounded-2xl border border-amber-300/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm backdrop-blur-md transition-all"
        style={{
          background: isListening
            ? "linear-gradient(135deg, rgba(254, 243, 235, 0.95) 0%, rgba(254, 230, 220, 0.9) 100%)"
            : "linear-gradient(135deg, rgba(254, 250, 242, 0.92) 0%, rgba(246, 238, 224, 0.88) 100%)",
        }}
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={toggleListening}
            disabled={busy}
            className={`flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl text-xl transition-all shadow-md active:scale-95 ${
              isListening
                ? "bg-rose-600 text-white ring-4 ring-rose-300/70 animate-pulse scale-105"
                : "bg-slate-900 text-amber-300 hover:bg-slate-800 hover:scale-105"
            }`}
            style={
              !isListening
                ? { background: "linear-gradient(135deg, #2D241E 0%, #15110E 100%)" }
                : undefined
            }
            title={isListening ? "Stop vocal capture" : "Click to activate acoustic capture"}
          >
            {isListening ? <MicOff size={26} /> : <Mic size={26} className="text-amber-400" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  isListening ? "bg-rose-500 animate-ping" : "bg-emerald-500"
                }`}
              />
              <span className="font-heading text-sm text-slate-900 font-bold">
                {isListening ? "Recording Live Speech — Speak Clearly Now" : "Acoustic Sensor Ready (Click Mic to Speak)"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-amber-950/70 font-medium">
              {isListening
                ? "Transcribing voice in real time: WPM cadence, fillers, and prosody tracking active."
                : "Click the microphone button to start speaking. Your speech will transcribe directly into the box."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {onSwitchToTyping && (
            <button
              type="button"
              onClick={onSwitchToTyping}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/60 bg-amber-100/70 px-3.5 py-2 font-mono text-xs font-semibold text-amber-950 hover:bg-amber-200/80 shadow-2xs transition-colors"
            >
              <Keyboard size={14} className="text-amber-800" /> Type Response
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-100/80 px-3.5 py-2 font-mono text-xs font-semibold text-rose-900 hover:bg-rose-200/90 disabled:opacity-40 transition-colors shadow-2xs"
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
        <div className="flex items-center justify-between text-xs font-mono text-amber-950/80 font-semibold">
          <span>REAL-TIME TRANSCRIPT & CANDIDATE AUDIT:</span>
          <span className="text-amber-800">
            {isListening ? "🔴 Acoustic live stream active" : "✓ Candidate can polish or edit transcript anytime"}
          </span>
        </div>

        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              prosody.setManualBaseText(e.target.value);
            }}
            rows={5}
            placeholder={
              isListening
                ? "Listening to speech... your spoken words are streaming here in real-time..."
                : "Candidate transcript will appear here when speaking. You can also edit, format, or type code snippets directly..."
            }
            className="w-full rounded-2xl border border-amber-300/70 bg-amber-50/60 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-500/80 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-amber-50/90 leading-relaxed font-sans shadow-inner transition-all"
          />
        </div>
      </div>
    </div>
  );
}
