import QuestionTimer from "./QuestionTimer.jsx";
import ScoreBars from "./ScoreBars.jsx";
import VoiceAnswerInput from "./VoiceAnswerInput.jsx";
import { Mic, ArrowRight, CheckCircle2, Award } from "lucide-react";

const AREA =
  "w-full rounded-2xl border border-amber-300/70 bg-amber-50/60 px-4 py-3.5 text-slate-900 placeholder-slate-500/80 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-amber-50/90 leading-relaxed font-sans shadow-inner transition-all";
const BTN =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-heading text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:w-auto shadow-md";

export default function InterviewCard({
  phase,
  role,
  step,
  question,
  answer,
  setAnswer,
  busy,
  last,
  onNext,
  onSubmit,
  voiceEnabled,
  setVoiceEnabled,
  isSpeechSupported,
}) {
  return (
    <div 
      className="ticket-card mt-6 p-6 sm:p-10 border border-amber-400/50 shadow-2xl relative overflow-hidden backdrop-blur-md"
      style={{
        background: "linear-gradient(145deg, rgba(254, 250, 242, 0.96) 0%, rgba(246, 238, 224, 0.93) 50%, rgba(239, 227, 208, 0.95) 100%)",
        boxShadow: "0 24px 60px -12px rgba(180, 130, 60, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
      }}
    >
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-amber-300/40">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 font-mono text-[10px] uppercase tracking-widest text-amber-950 font-bold shadow-2xs">
            <Award size={13} className="text-amber-700" />
            <span>{role} · QUESTION {step + 1} OF 4</span>
          </div>
          <p className="mt-4 font-heading text-xl sm:text-2xl font-bold leading-snug text-slate-900 tracking-tight">
            {question}
          </p>
        </div>
        {phase === "live" && <QuestionTimer key={step} />}
      </div>

      {phase === "live" ? (
        <div className="mt-6 space-y-5">
          {voiceEnabled && isSpeechSupported ? (
            <VoiceAnswerInput
              answer={answer}
              setAnswer={setAnswer}
              busy={busy}
              onSwitchToTyping={() => setVoiceEnabled(false)}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="font-semibold text-navy-900">YOUR RESPONSE:</span>
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={() => setVoiceEnabled(true)}
                    className="inline-flex items-center gap-1.5 text-[#0A1128] font-semibold hover:text-[#C5A059] transition-colors"
                  >
                    <Mic size={14} className="text-[#C5A059]" />
                    <span>Answer by Voice</span>
                  </button>
                )}
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder="Type your structured engineering answer here (STAR technique recommended: Situation, Task, Action, Result)…"
                className={AREA}
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onSubmit}
              disabled={busy || !answer.trim()}
              className={`${BTN} text-white disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] shadow-lg`}
              style={{ background: "linear-gradient(135deg, #2D241E 0%, #15110E 100%)" }}
            >
              <span>{busy ? "Evaluating Response Rigor…" : "Submit Answer for Assessment"}</span>
              <CheckCircle2 size={16} className="text-amber-400" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="ticket-perf my-6" />
          <ScoreBars score={last?.score} />
          {last?.feedback && (
            <div className="mt-5 rounded-xl bg-transparent relative z-10 border border-[#0A1128]/8 p-5 text-sm text-[#0A1128] leading-relaxed">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#9E7B35] block mb-1">
                Examiner Assessment Feedback
              </span>
              <p className="text-slate-700">{last.feedback}</p>
            </div>
          )}
          <button
            type="button"
            onClick={onNext}
            className={`${BTN} mt-6 bg-[#0A1128] text-white hover:bg-[#1E293B] hover:scale-[1.01]`}
          >
            <span>Proceed to Next Question</span>
            <ArrowRight size={15} className="text-[#C5A059]" />
          </button>
          <p className="mt-3 font-mono text-[11px] text-slate-400">
            Auto-advancing to subsequent interview round in 5 seconds…
          </p>
        </div>
      )}
    </div>
  );
}
