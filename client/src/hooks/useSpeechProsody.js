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
 * Real-time Speech Prosody & Continuous Speech-to-Text Telemetry Hook.
 * Uses Web Speech API (continuous SpeechRecognition with auto-restart) + Web Audio API (AnalyserNode).
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
  const accumulatedTextRef = useRef("");
  const sessionInterimRef = useRef("");

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startTimeRef = useRef(0);
  const lastSoundTimeRef = useRef(Date.now());
  const wordsSpokenRef = useRef(0);
  const pauseTriggeredRef = useRef(false);

  // Keep refs synchronized without recreating effects
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

  // Compute metrics from text
  const processMetrics = useCallback((fullText) => {
    const words = fullText.split(/\s+/).filter(Boolean);
    wordsSpokenRef.current = words.length;

    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    if (elapsedMinutes > 0.05) {
      const calculatedWpm = Math.round(words.length / elapsedMinutes);
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
    if (wpm > 185) score -= 10;
    if (wpm < 95 && wpm > 0) score -= 8;
    setFluencyScore(Math.max(45, Math.min(100, score)));
  }, [wpm]);

  // Handle active speech recognition session
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicError("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    let rec = null;
    let shouldRestart = false;

    const initRecognition = () => {
      try {
        rec = new SpeechRec();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = navigator.language || "en-US";

        rec.onresult = (event) => {
          let interim = "";
          let finalDelta = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const resultItem = event.results[i];
            if (resultItem.isFinal) {
              finalDelta += resultItem[0].transcript + " ";
            } else {
              interim += resultItem[0].transcript;
            }
          }

          if (finalDelta) {
            accumulatedTextRef.current += finalDelta;
          }
          sessionInterimRef.current = interim;

          const currentTotal = (accumulatedTextRef.current + " " + interim).replace(/\s+/g, " ").trim();
          setTranscript(currentTotal);
          processMetrics(currentTotal);

          if (onTranscriptUpdateRef.current) {
            onTranscriptUpdateRef.current(currentTotal);
          }
        };

        rec.onerror = (event) => {
          console.warn("[SPEECH RECOGNITION WARNING]", event.error);
          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            setMicError("Microphone access was denied. Please allow microphone permissions in your browser address bar.");
            shouldRestart = false;
          } else if (event.error === "audio-capture") {
            setMicError("No microphone was detected. Please verify your audio input hardware.");
            shouldRestart = false;
          }
          // "no-speech" is normal when candidate is thinking; onend will automatically keep listening
        };

        rec.onend = () => {
          // Chrome stops recognition automatically after speech pauses; restart continuously if still listening
          if (isListeningRef.current && shouldRestart) {
            try {
              rec.start();
            } catch (startErr) {
              console.warn("[SPEECH RESTART RETRY]", startErr);
            }
          }
        };

        recognitionRef.current = rec;
      } catch (err) {
        console.error("[SPEECH INIT ERROR]", err);
      }
    };

    initRecognition();

    if (isListening) {
      setMicError("");
      shouldRestart = true;
      startTimeRef.current = Date.now();
      lastSoundTimeRef.current = Date.now();
      wordsSpokenRef.current = 0;
      setPauseCount(0);
      setFillerCount(0);
      setDetectedFillers([]);
      setWpm(0);

      startAudioMeter();

      try {
        rec?.start();
      } catch (startErr) {
        console.warn("[SPEECH START INITIAL]", startErr);
      }
    } else {
      shouldRestart = false;
      stopAudioMeter();
      try {
        rec?.stop();
      } catch {}
    }

    return () => {
      shouldRestart = false;
      stopAudioMeter();
      try {
        rec?.abort();
      } catch {}
    };
  }, [isListening, processMetrics, startAudioMeter, stopAudioMeter]);

  const resetProsody = useCallback(() => {
    accumulatedTextRef.current = "";
    sessionInterimRef.current = "";
    setTranscript("");
    setWpm(0);
    setFillerCount(0);
    setDetectedFillers([]);
    setPauseCount(0);
    setFluencyScore(100);
  }, []);

  const setManualBaseText = useCallback((text) => {
    accumulatedTextRef.current = text ? text.trim() + " " : "";
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
