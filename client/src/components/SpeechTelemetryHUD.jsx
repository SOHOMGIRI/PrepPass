import React from "react";
import { Mic, Activity, AlertCircle, Zap, ShieldCheck } from "lucide-react";

export default function SpeechTelemetryHUD({
  wpm = 0,
  vocalEnergy = 0,
  fillerCount = 0,
  detectedFillers = [],
  pauseCount = 0,
  fluencyScore = 100,
  isRecording = false,
}) {
  const getWpmStatus = (val) => {
    if (val === 0) return { label: "Awaiting Speech", color: "text-slate-400" };
    if (val < 110) return { label: "Deliberate Pace", color: "text-blue-600" };
    if (val <= 165) return { label: "Optimal Cadence", color: "text-emerald-600" };
    return { label: "Rapid Delivery", color: "text-amber-600" };
  };

  const status = getWpmStatus(wpm);

  return (
    <div className="bg-white/90 backdrop-blur-md border border-[#0A1128]/10 rounded-xl p-4 shadow-sm transition-all">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#0A1128]/5">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-slate-300"}`} />
          <span className="text-xs font-mono font-bold tracking-wider text-navy-900 uppercase">
            Acoustic Fluency Telemetry
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#9E7B35] text-[11px] font-semibold">
          <ShieldCheck size={13} />
          <span>Real-time Prosody</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {/* Pacing / WPM */}
        <div className="p-2.5 rounded-lg bg-[#FDFBF7] border border-[#0A1128]/5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Cadence (WPM)</span>
          <div className="text-xl font-bold font-mono text-navy-900 mt-0.5">{wpm}</div>
          <span className={`text-[10px] font-medium ${status.color}`}>{status.label}</span>
        </div>

        {/* Vocal Amplitude */}
        <div className="p-2.5 rounded-lg bg-[#FDFBF7] border border-[#0A1128]/5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Vocal Amplitude</span>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[20, 40, 60, 80, 100].map((step, idx) => (
              <div
                key={idx}
                className="w-1.5 rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(6, (idx + 1) * 4)}px`,
                  backgroundColor: vocalEnergy >= step ? "#C5A059" : "#E2E8F0",
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">{vocalEnergy}% Vol</span>
        </div>

        {/* Fillers Tracked */}
        <div className="p-2.5 rounded-lg bg-[#FDFBF7] border border-[#0A1128]/5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Filler Words</span>
          <div className={`text-xl font-bold font-mono mt-0.5 ${fillerCount > 3 ? "text-amber-600" : "text-navy-900"}`}>
            {fillerCount}
          </div>
          <span className="text-[10px] text-slate-500">
            {fillerCount === 0 ? "Clean articulation" : `${detectedFillers.length} unique`}
          </span>
        </div>

        {/* Real-time Fluency Score */}
        <div className="p-2.5 rounded-lg bg-[#FDFBF7] border border-[#0A1128]/5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Fluency Index</span>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
            {fluencyScore}%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Executive Tier</span>
        </div>
      </div>

      {/* Detected Filler Tags */}
      {detectedFillers.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-[#0A1128]/5 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Detected:</span>
          {detectedFillers.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-50 text-amber-800 border border-amber-200"
            >
              "{f.word}" <strong className="text-amber-900">×{f.count}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
