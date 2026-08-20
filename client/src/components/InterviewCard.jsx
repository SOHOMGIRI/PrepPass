import QuestionTimer from "./QuestionTimer.jsx";
import ScoreBars from "./ScoreBars.jsx";
import VoiceAnswerInput from "./VoiceAnswerInput.jsx";

const AREA =
  "w-full rounded-lg border border-ink/20 bg-white px-4 py-3 text-ink placeholder-ink/40 focus:border-stamp-navy focus:outline-none focus:ring-2 focus:ring-stamp-navy/30 leading-relaxed font-body";
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
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
            {role} · Question {step + 1}
          </div>
          <p className="mt-4 font-heading text-xl leading-snug text-stamp-navy">
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
              <div className="flex items-center justify-between text-xs font-mono text-stamp-navy/60">
                <span>YOUR RESPONSE:</span>
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={() => setVoiceEnabled(true)}
                    className="flex items-center gap-1 text-stamp-navy hover:underline font-semibold"
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
              className={`${BTN} bg-stamp-navy text-white hover:bg-stamp-navy/90 disabled:opacity-60`}
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
            <p className="mt-4 rounded-lg bg-ticket/70 px-4 py-3 text-sm text-ink/75 leading-relaxed">
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
          <p className="mt-2 font-mono text-[10px] text-stamp-navy/50">
            Auto-advancing in a moment…
          </p>
        </div>
      )}
    </div>
  );
}
