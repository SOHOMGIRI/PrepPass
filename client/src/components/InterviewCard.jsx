import QuestionTimer from "./QuestionTimer.jsx";
import ScoreBars from "./ScoreBars.jsx";
import VoiceAnswerInput from "./VoiceAnswerInput.jsx";

const AREA =
  "w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-text-secondary placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-stamp-navy/30 leading-relaxed font-body";
const BTN =
  "inline-flex w-full items-center justify-center rounded-lg px-6 py-3 font-heading font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2 sm:w-auto";

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
    <div className="ticket-card mt-6 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
            {role} · Question {step + 1}
          </div>
          <p className="mt-4 font-heading text-xl leading-snug text-text-primary">
            {question}
          </p>
        </div>
        {phase === "live" && <QuestionTimer key={step} />}
      </div>

      {phase === "live" ? (
        <div className="mt-6 space-y-4">
          {voiceEnabled && isSpeechSupported ? (
            <VoiceAnswerInput
              answer={answer}
              setAnswer={setAnswer}
              busy={busy}
              onSwitchToTyping={() => setVoiceEnabled(false)}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-text-primary/60">
                <span>YOUR RESPONSE:</span>
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={() => setVoiceEnabled(true)}
                    className="flex items-center gap-1 text-text-primary hover:underline font-semibold"
                  >
                    <span>🎙️ Answer by Voice</span>
                  </button>
                )}
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder="Type your answer here…"
                className={AREA}
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onSubmit}
              disabled={busy || !answer.trim()}
              className={`${BTN} bg-gold text-[#0B0A14] hover:bg-gold-dark disabled:opacity-60`}
            >
              {busy ? "Scoring Answer…" : "Submit Answer ✓"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="ticket-perf my-6" />
          <ScoreBars score={last?.score} />
          {last?.feedback && (
            <p className="mt-4 rounded-lg bg-surface/70 px-4 py-3 text-sm text-text-secondary/75 leading-relaxed">
              {last.feedback}
            </p>
          )}
          <button
            type="button"
            onClick={onNext}
            className={`${BTN} mt-6 bg-gold text-white hover:bg-gold-dark`}
          >
            Next Question →
          </button>
          <p className="mt-2 font-mono text-[10px] text-text-primary/50">
            Auto-advancing in a moment…
          </p>
        </div>
      )}
    </div>
  );
}
