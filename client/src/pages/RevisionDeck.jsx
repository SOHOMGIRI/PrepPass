import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function RevisionDeck() {
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [includeMastered, setIncludeMastered] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "test" | "interview"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState("flashcard"); // "flashcard" | "grid"
  const [masteredCount, setMasteredCount] = useState(0);
  const [learningCount, setLearningCount] = useState(0);
  const [marking, setMarking] = useState(false);

  const fetchDeck = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `/revision/deck?includeMastered=${includeMastered}`
      );
      setDeck(data.deck || []);
      setMasteredCount(data.masteredCount || 0);
      setLearningCount(data.learningCount || 0);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not load revision deck."
      );
    } finally {
      setLoading(false);
    }
  }, [includeMastered]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  // Filtered cards based on type tab
  const filteredDeck = deck.filter((card) => {
    if (activeTab === "test") return card.type === "test";
    if (activeTab === "interview") return card.type === "interview";
    return true;
  });

  const currentCard = filteredDeck[currentIndex] || null;

  const handleMarkStatus = async (status) => {
    if (!currentCard || marking) return;
    setMarking(true);

    try {
      await api.post("/revision/mark", {
        cardKey: currentCard.cardKey,
        status,
      });

      // Update local state
      const updatedDeck = deck.map((c) =>
        c.cardKey === currentCard.cardKey ? { ...c, status } : c
      );

      if (status === "mastered" && !includeMastered) {
        // Remove from current deck if not including mastered
        const remaining = updatedDeck.filter(
          (c) => c.cardKey !== currentCard.cardKey
        );
        setDeck(remaining);
        setMasteredCount((prev) => prev + 1);
        setLearningCount((prev) => Math.max(0, prev - 1));
        if (currentIndex >= remaining.length) {
          setCurrentIndex(Math.max(0, remaining.length - 1));
        }
      } else {
        setDeck(updatedDeck);
        if (status === "mastered") {
          setMasteredCount((prev) => prev + 1);
          setLearningCount((prev) => Math.max(0, prev - 1));
        } else {
          setLearningCount((prev) => prev + 1);
          setMasteredCount((prev) => Math.max(0, prev - 1));
        }
        // Advance to next card
        if (currentIndex < filteredDeck.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }
      setIsFlipped(false);
    } catch (err) {
      console.error("Failed to mark card status:", err);
    } finally {
      setMarking(false);
    }
  };

  const shuffleDeck = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-10 font-body text-text-secondary">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="font-mono text-xs text-text-primary/70 hover:underline"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/test-mode"
              className="font-mono text-xs text-text-primary/70 hover:underline"
            >
              Test Mode →
            </Link>
            <Link
              to="/interview"
              className="font-mono text-xs text-text-primary/70 hover:underline"
            >
              Mock Interview →
            </Link>
          </div>
        </div>

        {/* Title & Stats Card */}
        <div className="ticket-card p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
              SMART REVISION DECK
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="rounded bg-gold/15 px-2.5 py-1 text-text-primary font-bold">
                {learningCount} Learning
              </span>
              <span className="rounded bg-green-100 px-2.5 py-1 text-green-900 font-bold">
                {masteredCount} Mastered
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl text-text-primary sm:text-3xl">
                Weak-Area Revision Deck
              </h1>
              <p className="mt-1 text-xs text-text-secondary/70 max-w-md">
                Flashcards automatically generated from incorrect test MCQs and low-scoring interview questions.
              </p>
            </div>

            {/* Toggle: Include Mastered */}
            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-text-primary/80 select-none bg-surface p-2.5 rounded-lg border border-white/10 hover:bg-surface/30 transition">
              <input
                type="checkbox"
                checked={includeMastered}
                onChange={(e) => setIncludeMastered(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 text-text-primary focus:ring-stamp-navy"
              />
              <span>Show Mastered Cards</span>
            </label>
          </div>

          {/* Type Filter & View Mode Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dashed border-white/10">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("all");
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                  activeTab === "all"
                    ? "bg-stamp-navy text-gold"
                    : "bg-stamp-navy/10 text-text-primary hover:bg-stamp-navy/20"
                }`}
              >
                All ({deck.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("test");
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                  activeTab === "test"
                    ? "bg-stamp-navy text-gold"
                    : "bg-stamp-navy/10 text-text-primary hover:bg-stamp-navy/20"
                }`}
              >
                Tests ({deck.filter((c) => c.type === "test").length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("interview");
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                  activeTab === "interview"
                    ? "bg-stamp-navy text-gold"
                    : "bg-stamp-navy/10 text-text-primary hover:bg-stamp-navy/20"
                }`}
              >
                Interviews ({deck.filter((c) => c.type === "interview").length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={shuffleDeck}
                disabled={deck.length <= 1}
                className="rounded-lg border border-white/10 bg-surface px-3 py-1.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/5 disabled:opacity-40"
              >
                🔀 Shuffle
              </button>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "flashcard" ? "grid" : "flashcard")}
                className="rounded-lg border border-white/10 bg-surface px-3 py-1.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/5"
              >
                {viewMode === "flashcard" ? "📋 Grid View" : "🗂️ Flashcard View"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
            {error}
          </p>
        )}

        {loading ? (
          <div className="ticket-card flex items-center justify-center gap-3 py-16 text-text-primary/70">
            <span className="font-mono animate-pulse text-lg">•••</span>
            <span className="font-heading">Loading your revision deck…</span>
          </div>
        ) : filteredDeck.length === 0 ? (
          /* Empty State */
          <div className="ticket-card p-8 sm:p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-3xl">
              🎉
            </div>
            <div>
              <h2 className="font-heading text-2xl text-text-primary">
                No Weak Areas in Deck!
              </h2>
              <p className="mt-1 text-xs text-text-secondary/70 max-w-md mx-auto leading-relaxed">
                {includeMastered
                  ? "You haven't missed any questions across your tests and interviews yet."
                  : "Great job! You have mastered all your weak areas. Take more tests or interviews to generate new revision cards."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                to="/test-mode"
                className="rounded-lg bg-stamp-navy px-6 py-2.5 font-heading text-xs font-semibold text-gold hover:bg-stamp-navy/90"
              >
                Take a Proctored Test ⏱️
              </Link>
              <Link
                to="/interview"
                className="rounded-lg bg-gold px-6 py-2.5 font-heading text-xs font-semibold text-gold hover:bg-gold-dark"
              >
                Start Mock Interview 🎙️
              </Link>
              <Link
                to="/aptitude"
                className="rounded-lg border border-white/10 bg-surface px-5 py-2.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/5"
              >
                Aptitude Practice 📐
              </Link>
            </div>
          </div>
        ) : viewMode === "flashcard" && currentCard ? (
          /* Flashcard View */
          <div className="space-y-4">
            {/* Card Position & Navigation Counter */}
            <div className="flex items-center justify-between text-xs font-mono text-text-primary/60 px-1">
              <span>
                CARD {currentIndex + 1} OF {filteredDeck.length}
              </span>
              <span>
                {currentCard.status === "mastered" ? "✓ Mastered" : "⏳ Learning"}
              </span>
            </div>

            {/* Interactive Flashcard Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="ticket-card min-h-[340px] p-6 sm:p-10 cursor-pointer transition-all duration-300 hover:border-white/10 bg-surface flex flex-col justify-between shadow-sm relative group"
            >
              {/* Top Card Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold ${
                      currentCard.type === "test"
                        ? "bg-gold/20 text-text-primary"
                        : "bg-stamp-navy/10 text-text-primary"
                    }`}
                  >
                    {currentCard.type === "test" ? "TEST MCQ" : "INTERVIEW QUESTION"}
                  </span>
                  <span className="font-mono text-xs text-text-primary/70 font-semibold">
                    {currentCard.subjectOrRole}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-text-primary/40">
                  {fmtDate(currentCard.sourceDate)}
                </span>
              </div>

              {/* Card Content (Front vs Back) */}
              <div className="my-6 space-y-4">
                {!isFlipped ? (
                  /* FRONT: Question */
                  <div className="space-y-4">
                    <h2 className="font-heading text-xl sm:text-2xl text-text-primary leading-snug">
                      {currentCard.front}
                    </h2>

                    {currentCard.type === "test" && currentCard.options?.length === 4 && (
                      <div className="grid gap-2 sm:grid-cols-2 pt-2">
                        {currentCard.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="rounded-lg border border-white/10 bg-surface/40 p-3 text-xs text-text-secondary/80 flex items-start gap-2"
                          >
                            <span className="font-mono font-bold text-text-primary">
                              {["A", "B", "C", "D"][oIdx]}.
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* BACK: Answer / Feedback */
                  <div className="space-y-4 animate-fadeIn">
                    <div className="rounded-lg border border-green-300 bg-green-50/70 p-4 space-y-2">
                      <div className="font-mono text-[10px] uppercase font-bold text-green-900">
                        {currentCard.type === "test"
                          ? "✓ CORRECT ANSWER"
                          : "🎙️ AI FEEDBACK & KEY CONCEPTS"}
                      </div>
                      <p className="font-heading text-base text-green-950 font-semibold">
                        {currentCard.type === "test"
                          ? currentCard.correctAnswer
                          : currentCard.back}
                      </p>
                    </div>

                    {currentCard.explanation && (
                      <div className="rounded-lg border border-white/10 bg-surface/50 p-4 text-xs text-text-secondary/80 space-y-1">
                        <div className="font-mono text-[10px] uppercase font-bold text-text-primary">
                          💡 Explanation:
                        </div>
                        <p className="leading-relaxed">{currentCard.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Flip Hint */}
              <div className="pt-4 border-t border-dashed border-white/10 flex items-center justify-between text-xs font-mono text-text-primary/60">
                <span>{isFlipped ? "↩️ Click anywhere to flip back" : "💡 Click to reveal answer & explanation"}</span>
                <span className="group-hover:text-text-primary font-bold">
                  {isFlipped ? "BACK" : "FRONT"}
                </span>
              </div>
            </div>

            {/* Action Bar (Got It vs Still Learning) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(Math.max(0, currentIndex - 1));
                    setIsFlipped(false);
                  }}
                  disabled={currentIndex === 0}
                  className="rounded-lg border border-white/10 bg-surface px-4 py-2 font-mono text-xs text-text-primary hover:bg-stamp-navy/5 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(Math.min(filteredDeck.length - 1, currentIndex + 1));
                    setIsFlipped(false);
                  }}
                  disabled={currentIndex >= filteredDeck.length - 1}
                  className="rounded-lg border border-white/10 bg-surface px-4 py-2 font-mono text-xs text-text-primary hover:bg-stamp-navy/5 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleMarkStatus("learning")}
                  disabled={marking}
                  className="flex-1 sm:flex-none rounded-lg bg-gold/20 border border-gold/50 px-5 py-2.5 font-heading text-xs font-semibold text-text-primary hover:bg-gold/30 disabled:opacity-50"
                >
                  ⏳ Still Learning
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkStatus("mastered")}
                  disabled={marking}
                  className="flex-1 sm:flex-none rounded-lg bg-green-600 px-6 py-2.5 font-heading text-xs font-semibold text-gold hover:bg-green-700 disabled:opacity-50 shadow-sm"
                >
                  ✓ Got it! (Mastered)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View Mode */
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredDeck.map((card, idx) => (
                <div
                  key={card.cardKey || idx}
                  className="ticket-card p-5 space-y-3 bg-surface flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="ticket-stamp rounded px-2 py-0.5 font-mono text-[9px] uppercase text-text-primary">
                        {card.type === "test" ? "TEST" : "INTERVIEW"} · {card.subjectOrRole}
                      </span>
                      <span
                        className={`font-mono text-[10px] font-bold ${
                          card.status === "mastered"
                            ? "text-green-700"
                            : "text-gold"
                        }`}
                      >
                        {card.status === "mastered" ? "✓ Mastered" : "Learning"}
                      </span>
                    </div>
                    <h3 className="font-heading text-sm text-text-primary line-clamp-3">
                      {card.front}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-dashed border-white/10 text-xs text-text-secondary/75 space-y-1">
                    <div className="font-mono text-[10px] text-green-900 font-bold">
                      {card.type === "test" ? "Answer:" : "Key Takeaway:"}
                    </div>
                    <p className="line-clamp-2 text-xs">
                      {card.type === "test" ? card.correctAnswer : card.back}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
