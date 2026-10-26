import { useState, useEffect, useRef, useCallback } from "react";

const COMMON_FILLERS = [
  "um",
  "uh",
  "erm",
  "ah",
  "like",
  "basically",
  "actually",
  "literally",
  "sort of",
  "kind of",
  "you know",
  "right",
];

/**
 * Real-time Speech Prosody & Persistent Continuous Speech-to-Text Telemetry Hook.
 * Ensures previously spoken text is NEVER wiped out or replaced when browser speech pauses.
 */
export function useSpeechProsody({ isListening = false, onTranscriptUpdate = null }) {
  const [transcript, setTranscript] = useState("");
  const [wpm, setWpm] = useState(0);
  const [vocalEnergy, setVocalEnergy] = useState(0); // 0-100
  const [fillerCount, setFillerCount] = useState(0);
  const [detectedFillers, setDetectedFillers] = useState([]);
  const [pauseCount, setPauseCount] = useState(0);
  const [fluencyScore, setFluencyScore] = useState(100);
  const [micError, setMicError] = useState("");

  const isListeningRef = useRef(isListening);
  const onTranscriptUpdateRef = useRef(onTranscriptUpdate);
  const shouldRestartRef = useRef(false);

  // Permanent base text accumulator that survives browser speech-engine restarts
  const baseTextRef = useRef("");
  const sessionFinalRef = useRef("");

  const wpmRef = useRef(0);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startTimeRef = useRef(0);
  const lastSoundTimeRef = useRef(Date.now());
  const wordsSpokenRef = useRef(0);
  const pauseTriggeredRef = useRef(false);

  // Synchronize state into refs to avoid any effect re-creations
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    onTranscriptUpdateRef.current = onTranscriptUpdate;
  }, [onTranscriptUpdate]);

  // Audio level meter using Web Audio API
  const startAudioMeter = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      microphoneRef.current = { stream, source };

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current || !isListeningRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setVocalEnergy(normalized);

        // Long pause detection (> 3.5 seconds of silence while speaking)
        const now = Date.now();
        if (normalized > 12) {
          lastSoundTimeRef.current = now;
          pauseTriggeredRef.current = false;
        } else if (
          now - lastSoundTimeRef.current > 3500 &&
          !pauseTriggeredRef.current &&
          wordsSpokenRef.current > 5
        ) {
          setPauseCount((prev) => prev + 1);
          pauseTriggeredRef.current = true;
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn("[SPEECH PROSODY] Audio meter optional hook:", err.message);
    }
  }, []);

  const stopAudioMeter = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (microphoneRef.current?.stream) {
      microphoneRef.current.stream.getTracks().forEach((track) => track.stop());
      microphoneRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setVocalEnergy(0);
  }, []);

  // Compute metrics from text without any external state dependencies
  const processMetrics = useCallback((fullText) => {
    if (!fullText) return;
    const words = fullText.split(/\s+/).filter(Boolean);
    wordsSpokenRef.current = words.length;

    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    if (elapsedMinutes > 0.05) {
      const calculatedWpm = Math.round(words.length / elapsedMinutes);
      wpmRef.current = calculatedWpm;
      setWpm(calculatedWpm);
    }

    // Detect filler words
    const lowerText = fullText.toLowerCase();
    const detected = [];
    let totalFillers = 0;

    for (const filler of COMMON_FILLERS) {
      const regex = new RegExp(`\\b${filler}\\b`, "gi");
      const matches = lowerText.match(regex);
      if (matches && matches.length > 0) {
        totalFillers += matches.length;
        detected.push({ word: filler, count: matches.length });
      }
    }

    setFillerCount(totalFillers);
    setDetectedFillers(detected);

    let score = 100;
    score -= totalFillers * 3;
    const currentWpm = wpmRef.current;
    if (currentWpm > 185) score -= 10;
    if (currentWpm < 95 && currentWpm > 0) score -= 8;
    setFluencyScore(Math.max(45, Math.min(100, score)));
  }, []);

  // Main SpeechRecognition lifecycle — ONLY triggered when isListening toggles
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicError("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    let rec = null;

    try {
      rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = navigator.language || "en-US";

      rec.onresult = (event) => {
        let currentSessionFinal = "";
        let currentInterim = "";

        // Collect all transcripts in the current recognition session
        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            currentSessionFinal += item[0].transcript + " ";
          } else {
            currentInterim += item[0].transcript;
          }
        }

        sessionFinalRef.current = currentSessionFinal;

        // Combine permanent base text + finalized words + active interim speech
        const combined = [
          baseTextRef.current.trim(),
          currentSessionFinal.trim(),
          currentInterim.trim(),
        ]
          .filter(Boolean)
          .join(" ");

        setTranscript(combined);
        processMetrics(combined);

        if (onTranscriptUpdateRef.current) {
          onTranscriptUpdateRef.current(combined);
        }
      };

      rec.onerror = (event) => {
        console.warn("[SPEECH RECOGNITION STATUS]", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicError("Microphone access was denied. Please allow microphone permissions in your browser address bar.");
          shouldRestartRef.current = false;
        } else if (event.error === "audio-capture") {
          setMicError("No microphone detected. Please verify your audio hardware.");
          shouldRestartRef.current = false;
        }
      };

      rec.onend = () => {
        // Commit whatever was finalized in this session into the permanent base text
        if (sessionFinalRef.current) {
          baseTextRef.current = [baseTextRef.current.trim(), sessionFinalRef.current.trim()]
            .filter(Boolean)
            .join(" ") + " ";
          sessionFinalRef.current = "";
        }

        // If listening is still active, restart immediately so old words are never lost
        if (isListeningRef.current && shouldRestartRef.current) {
          try {
            rec.start();
          } catch (restartErr) {
            console.warn("[SPEECH RESTART QUIET RETRY]", restartErr);
          }
        }
      };

      recognitionRef.current = rec;
    } catch (err) {
      console.error("[SPEECH INIT ERROR]", err);
    }

    if (isListening) {
      setMicError("");
      shouldRestartRef.current = true;
      startTimeRef.current = Date.now();
      lastSoundTimeRef.current = Date.now();
      wordsSpokenRef.current = 0;
      setPauseCount(0);
      setFillerCount(0);
      setDetectedFillers([]);
      wpmRef.current = 0;
      setWpm(0);

      startAudioMeter();

      try {
        rec?.start();
      } catch (startErr) {
        console.warn("[SPEECH START INITIAL]", startErr);
      }
    } else {
      shouldRestartRef.current = false;
      stopAudioMeter();

      // Commit finalized words into base text
      if (sessionFinalRef.current) {
        baseTextRef.current = [baseTextRef.current.trim(), sessionFinalRef.current.trim()]
          .filter(Boolean)
          .join(" ") + " ";
        sessionFinalRef.current = "";
      }

      try {
        rec?.stop();
      } catch {}
    }

    return () => {
      shouldRestartRef.current = false;
      stopAudioMeter();
      try {
        rec?.abort();
      } catch {}
    };
  }, [isListening, processMetrics, startAudioMeter, stopAudioMeter]);

  const resetProsody = useCallback(() => {
    baseTextRef.current = "";
    sessionFinalRef.current = "";
    setTranscript("");
    wpmRef.current = 0;
    setWpm(0);
    setFillerCount(0);
    setDetectedFillers([]);
    setPauseCount(0);
    setFluencyScore(100);
  }, []);

  const setManualBaseText = useCallback((text) => {
    baseTextRef.current = text ? text.trim() + " " : "";
    sessionFinalRef.current = "";
  }, []);

  return {
    transcript,
    wpm,
    vocalEnergy,
    fillerCount,
    detectedFillers,
    pauseCount,
    fluencyScore,
    micError,
    setMicError,
    resetProsody,
    setManualBaseText,
  };
}
