import { useEffect, useRef, useState, useCallback } from "react";

export default function VoiceAnswerInput({
  answer,
  setAnswer,
  busy,
  onSwitchToTyping,
}) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let currentInterim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + " ";
        } else {
          currentInterim += transcriptPart;
        }
      }

      if (finalTranscript) {
        setAnswer((prev) => {
          const trimmedPrev = prev.trim();
          return trimmedPrev ? `${trimmedPrev} ${finalTranscript.trim()}` : finalTranscript.trim();
        });
      }

      setInterimText(currentInterim);
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicError("Microphone permission was denied. Please allow mic access in your browser settings.");
      } else if (event.error !== "no-speech") {
        setMicError(`Voice input error: ${event.error}`);
      }
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      // If still supposed to be listening, restart (some browsers timeout on continuous)
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
          isListeningRef.current = false;
        }
      } else {
        setIsListening(false);
        setInterimText("");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isListeningRef.current = false;
      try {
        recognition.stop();
      } catch {}
    };
  }, [setAnswer]);

  const toggleListening = useCallback(() => {
    setMicError("");
    if (!recognitionRef.current) return;

    if (isListening) {
      isListeningRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
      setInterimText("");
    } else {
      isListeningRef.current = true;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Could not start speech recognition:", err);
        setIsListening(false);
        isListeningRef.current = false;
      }
    }
  }, [isListening]);

  return (
    <div className="space-y-4">
      {micError && (
        <div className="rounded-lg bg-gold/10 p-3 font-mono text-xs text-stamp-maroon flex items-center justify-between">
          <span>{micError}</span>
          <button
            type="button"
            onClick={() => setMicError("")}
            className="text-stamp-maroon font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Voice Control Action Banner */}
      <div className="rounded-xl border border-stamp-navy/20 bg-ticket/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleListening}
            disabled={busy}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl transition-all shadow-md ${
              isListening
                ? "bg-red-600 text-white animate-pulse ring-4 ring-red-200"
                : "bg-stamp-navy text-white hover:bg-stamp-navy/90 hover:scale-105"
            }`}
            title={isListening ? "Click to stop recording" : "Click to start recording"}
          >
            {isListening ? "⏹️" : "🎙️"}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  isListening ? "bg-red-500 animate-ping" : "bg-green-500"
                }`}
              />
              <span className="font-heading text-sm text-stamp-navy font-bold">
                {isListening ? "Listening… Speak your answer" : "Microphone Ready"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-ink/60">
              {isListening
                ? "Speak naturally. Your words will appear below in real-time."
                : "Click the microphone button to start answering with voice."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToTyping && (
            <button
              type="button"
              onClick={onSwitchToTyping}
              className="rounded-lg border border-stamp-navy/30 bg-white px-3 py-1.5 font-mono text-xs text-stamp-navy hover:bg-stamp-navy/5"
            >
              ⌨️ Type Instead
            </button>
          )}
          {answer.trim() && (
            <button
              type="button"
              onClick={() => setAnswer("")}
              disabled={busy || isListening}
              className="rounded-lg border border-red-300 bg-white px-3 py-1.5 font-mono text-xs text-stamp-maroon hover:bg-red-50 disabled:opacity-40"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Editable Live Transcript Box */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-stamp-navy/60">
          <span>LIVE TRANSCRIPT & REVIEW:</span>
          <span>{isListening ? "🎙️ Recording in progress" : "✓ Editable before submission"}</span>
        </div>

        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            placeholder={
              isListening
                ? "Listening... your transcribed speech will appear here..."
                : "Your transcribed answer will appear here. You can also edit or type manually..."
            }
            className="w-full rounded-lg border border-ink/20 bg-white px-4 py-3 text-sm text-ink placeholder-ink/40 focus:border-stamp-navy focus:outline-none focus:ring-2 focus:ring-stamp-navy/30 leading-relaxed font-body"
          />

          {interimText && (
            <div className="mt-1 rounded-md bg-gold/10 px-3 py-1.5 font-mono text-xs text-gold italic">
              Hearing: "{interimText}…"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
