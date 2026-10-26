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
 * Real-time Speech Prosody & Fluency Telemetry Hook.
 * Uses Web Audio API (AnalyserNode) + SpeechRecognition.
 */
export function useSpeechProsody({ isListening = false, onTranscriptUpdate = null }) {
  const [transcript, setTranscript] = useState("");
  const [wpm, setWpm] = useState(0);
  const [vocalEnergy, setVocalEnergy] = useState(0); // 0-100
  const [fillerCount, setFillerCount] = useState(0);
  const [detectedFillers, setDetectedFillers] = useState([]);
  const [pauseCount, setPauseCount] = useState(0);
  const [fluencyScore, setFluencyScore] = useState(100);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recognitionRef = useRef(null);

  const startTimeRef = useRef(0);
  const lastSoundTimeRef = useRef(Date.now());
  const wordsSpokenRef = useRef(0);
  const pauseTriggeredRef = useRef(false);

  // Analyze audio input levels for vocal volume/energy
  const startAudioMeter = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
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
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setVocalEnergy(normalized);

        // Silence / pause detection (> 3 seconds)
        const now = Date.now();
        if (normalized > 12) {
          lastSoundTimeRef.current = now;
          pauseTriggeredRef.current = false;
        } else if (now - lastSoundTimeRef.current > 3000 && !pauseTriggeredRef.current && wordsSpokenRef.current > 5) {
          setPauseCount((prev) => prev + 1);
          pauseTriggeredRef.current = true;
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn("[SPEECH PROSODY] AudioContext meter unavailable:", err.message);
    }
  }, []);

  const stopAudioMeter = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (microphoneRef.current?.stream) {
      microphoneRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    setVocalEnergy(0);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + " ";
      }
      fullTranscript = fullTranscript.trim();
      setTranscript(fullTranscript);
      if (onTranscriptUpdate) {
        onTranscriptUpdate(fullTranscript);
      }

      // Calculate words and WPM
      const words = fullTranscript.split(/\s+/).filter(Boolean);
      wordsSpokenRef.current = words.length;

      const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      if (elapsedMinutes > 0.05) {
        const calculatedWpm = Math.round(words.length / elapsedMinutes);
        setWpm(calculatedWpm);
      }

      // Detect filler words
      const lowerText = fullTranscript.toLowerCase();
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

      // Compute composite fluency score (100 base, deductions for fillers and excessive pace deviance)
      let score = 100;
      score -= totalFillers * 3;
      if (wpm > 180) score -= 10;
      if (wpm < 100 && wpm > 0) score -= 8;
      setFluencyScore(Math.max(40, Math.min(100, score)));
    };

    rec.onerror = (err) => {
      console.warn("[SPEECH RECOGNITION] Event error:", err.error);
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.abort();
      } catch {}
    };
  }, [onTranscriptUpdate, wpm]);

  // Handle isListening state change
  useEffect(() => {
    if (isListening) {
      startTimeRef.current = Date.now();
      lastSoundTimeRef.current = Date.now();
      wordsSpokenRef.current = 0;
      setPauseCount(0);
      setFillerCount(0);
      setDetectedFillers([]);
      setTranscript("");
      setWpm(0);

      startAudioMeter();
      try {
        recognitionRef.current?.start();
      } catch {}
    } else {
      stopAudioMeter();
      try {
        recognitionRef.current?.stop();
      } catch {}
    }

    return () => {
      stopAudioMeter();
      try {
        recognitionRef.current?.abort();
      } catch {}
    };
  }, [isListening, startAudioMeter, stopAudioMeter]);

  const resetProsody = useCallback(() => {
    setTranscript("");
    setWpm(0);
    setFillerCount(0);
    setDetectedFillers([]);
    setPauseCount(0);
    setFluencyScore(100);
  }, []);

  return {
    transcript,
    wpm,
    vocalEnergy,
    fillerCount,
    detectedFillers,
    pauseCount,
    fluencyScore,
    resetProsody,
  };
}
