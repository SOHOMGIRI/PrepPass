import mongoose from "mongoose";
import TestQuestion from "../models/TestQuestion.js";
import TestSession from "../models/TestSession.js";
import ReportUnlock from "../models/ReportUnlock.js";
import { callGeminiJSON } from "../utils/gemini.js";

/**
 * Tolerant session ownership checker to support guest mode, token rotation, and reload recovery
 */
function checkTestSessionOwner(session, reqUserId) {
  const DEMO_GUEST_ID = "650000000000000000000000";
  const currentUserId = (reqUserId || DEMO_GUEST_ID).toString();
  const sessionOwnerId = (session.userId || DEMO_GUEST_ID).toString();

  if (sessionOwnerId !== currentUserId) {
    if (currentUserId !== DEMO_GUEST_ID && sessionOwnerId === DEMO_GUEST_ID) {
      session.userId = reqUserId;
    } else if (currentUserId === DEMO_GUEST_ID) {
      // Allow candidate to proceed uninterrupted if token refreshed or expired into guest mode
    } else {
      session.userId = reqUserId;
    }
  }
}

/**
 * Deterministic MCQ Fallback Bank for Core Engineering & Academic Subjects
 */
const DETERMINISTIC_MCQ_BANK = {
  dbms: [
    {
      questionText: "Which normal form specifically addresses and removes transitive dependencies on candidate keys?",
      options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
      correctOptionIndex: 2,
      explanation: "Third Normal Form (3NF) requires a relation to be in 2NF and have no transitive functional dependencies of non-prime attributes on candidate keys.",
      difficulty: "medium",
    },
    {
      questionText: "In the ACID transaction model, which component is primarily responsible for guaranteeing durability in the event of sudden server crashes?",
      options: ["Write-Ahead Logging (WAL)", "Two-Phase Locking (2PL)", "Snapshot Isolation", "Hash Indexes"],
      correctOptionIndex: 0,
      explanation: "Write-Ahead Logging (WAL) ensures changes are appended to non-volatile disk before in-memory buffer pages are flushed, guaranteeing crash recovery durability.",
      difficulty: "medium",
    },
    {
      questionText: "What is the primary difference between a clustered and a non-clustered index in relational databases?",
      options: [
        "A clustered index defines physical row order; a table can have only one clustered index.",
        "A clustered index cannot contain duplicate values.",
        "A non-clustered index can only index numeric data types.",
        "Non-clustered indexes do not require additional disk storage."
      ],
      correctOptionIndex: 0,
      explanation: "Because physical table rows can only be ordered one way on disk, a table can only possess a single clustered index, whereas multiple non-clustered pointers can coexist.",
      difficulty: "medium",
    },
  ],
  os: [
    {
      questionText: "Which synchronization primitive prevents priority inversion in real-time operating systems?",
      options: ["Priority Inheritance Protocol", "Peterson's Algorithm", "Counting Semaphore", "Banker's Algorithm"],
      correctOptionIndex: 0,
      explanation: "Priority inheritance temporarily elevates the priority of a low-priority thread holding a resource to match the highest-priority waiting thread, preventing intermediate threads from preempting it.",
      difficulty: "medium",
    },
    {
      questionText: "What hardware mechanism allows the operating system to intercept and isolate invalid memory accesses between processes?",
      options: ["Memory Management Unit (MMU) Page Faults", "Direct Memory Access (DMA)", "Instruction Pipelining", "Clock Interrupt Generator"],
      correctOptionIndex: 0,
      explanation: "The MMU maps virtual to physical memory and raises a page fault exception when an unmapped or privileged page is accessed, enabling operating system paging and process isolation.",
      difficulty: "medium",
    },
    {
      questionText: "Which condition is NOT one of Coffman's four necessary conditions for system deadlocks to occur?",
      options: ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
      correctOptionIndex: 2,
      explanation: "Deadlock requires No Preemption. If preemption is allowed (resources can be forcefully revoked), deadlocks cannot form.",
      difficulty: "medium",
    },
  ],
  networks: [
    {
      questionText: "During a TCP three-way handshake, what packet flags are exchanged in sequence to establish a connection?",
      options: ["SYN -> SYN-ACK -> ACK", "ACK -> SYN -> SYN-ACK", "SYN -> ACK -> FIN", "RST -> SYN -> ACK"],
      correctOptionIndex: 0,
      explanation: "The client sends SYN, the server responds with SYN-ACK, and the client acknowledges with ACK to establish full-duplex sequence numbers.",
      difficulty: "medium",
    },
    {
      questionText: "Which DNS record type maps an alias domain name to its canonical domain name rather than an IP address?",
      options: ["CNAME", "A Record", "MX Record", "PTR Record"],
      correctOptionIndex: 0,
      explanation: "A CNAME (Canonical Name) record aliases one domain name to another, routing queries through the canonical destination's resolution chain.",
      difficulty: "medium",
    },
    {
      questionText: "In the HTTP/2 specification, what mechanism allows multiplexing multiple simultaneous request-response streams over a single TCP connection?",
      options: ["Binary Framing Layer", "WebSocket Tunnels", "Keep-Alive Heartbeats", "Chunked Transfer Encoding"],
      correctOptionIndex: 0,
      explanation: "HTTP/2 breaks conversations into independent binary frames tagged with stream identifiers, eliminating head-of-line blocking at the application protocol layer.",
      difficulty: "medium",
    },
  ],
  dsa: [
    {
      questionText: "What is the worst-case time complexity of QuickSort when a naive first-element pivot selection is used on an already sorted array?",
      options: ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"],
      correctOptionIndex: 0,
      explanation: "When the array is already sorted and the first element is chosen as pivot, each partition yields subarrays of size 0 and N-1, degenerating recursion depth to O(N) and total time to O(N^2).",
      difficulty: "medium",
    },
    {
      questionText: "Which data structure provides amortized O(1) time complexity for both finding the representative of a set and merging two disjoint sets?",
      options: ["Disjoint Set Union (DSU) with Path Compression & Union by Rank", "Binary Search Tree", "Fibonacci Heap", "Trie"],
      correctOptionIndex: 0,
      explanation: "DSU (Union-Find) with both path compression and union by rank achieves near-constant inverse Ackermann time O(alpha(N)) ~ O(1) amortized per operation.",
      difficulty: "medium",
    },
    {
      questionText: "In an undirected graph, which algorithmic strategy is optimal to determine the presence of a cycle in O(V + E) time?",
      options: ["Breadth-First Search (BFS) or Depth-First Search (DFS) with visited state tracking", "Dijkstra's Shortest Path Algorithm", "Floyd-Warshall Algorithm", "Kruskal's Algorithm without DSU"],
      correctOptionIndex: 0,
      explanation: "Tracking visited vertices during BFS/DFS and checking if an adjacent visited vertex is not the parent vertex detects back-edges / cycles in linear O(V + E) time.",
      difficulty: "medium",
    },
  ],
  general: [
    {
      questionText: "In distributed computing architectures, what does the CAP theorem state regarding networked data stores?",
      options: [
        "A system can provide at most two guarantees simultaneously out of Consistency, Availability, and Partition Tolerance.",
        "A system must sacrifice performance to achieve ACID properties.",
        "Caching and Sharding cannot operate concurrently.",
        "Relational databases cannot scale beyond a single physical server."
      ],
      correctOptionIndex: 0,
      explanation: "Under network partitions (P), a distributed system must trade off strict consistency (C) against continuous operational availability (A).",
      difficulty: "medium",
    },
    {
      questionText: "What does the Idempotency property mean in RESTful API design?",
      options: [
        "Making multiple identical requests produces the exact same server-side state as making a single request.",
        "The API requires no authentication credentials.",
        "All requests execute asynchronously using background queues.",
        "The response payload is always formatted in binary Protobuf."
      ],
      correctOptionIndex: 0,
      explanation: "Idempotent HTTP methods (like GET, PUT, DELETE) guarantee that repeating identical requests leaves the server in the identical resulting state without unintended side-effects.",
      difficulty: "medium",
    },
  ],
};

function getDeterministicQuestionsForSubject(subject, count) {
  const sLower = (subject || "").toLowerCase();
  let pool = DETERMINISTIC_MCQ_BANK.general;
  if (sLower.includes("data") || sLower.includes("algo") || sLower.includes("dsa") || sLower.includes("array")) {
    pool = DETERMINISTIC_MCQ_BANK.dsa;
  } else if (sLower.includes("database") || sLower.includes("dbms") || sLower.includes("sql")) {
    pool = DETERMINISTIC_MCQ_BANK.dbms;
  } else if (sLower.includes("operat") || sLower.includes("os") || sLower.includes("linux") || sLower.includes("thread")) {
    pool = DETERMINISTIC_MCQ_BANK.os;
  } else if (sLower.includes("network") || sLower.includes("tcp") || sLower.includes("http") || sLower.includes("web")) {
    pool = DETERMINISTIC_MCQ_BANK.networks;
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    const item = pool[i % pool.length];
    results.push({
      subject: subject.trim(),
      difficulty: item.difficulty,
      questionText: item.questionText,
      options: item.options,
      correctOptionIndex: item.correctOptionIndex,
      explanation: item.explanation,
    });
  }
  return results;
}

/**
 * Helper to generate and save MCQ test questions via Gemini.
 */
async function generateAndSaveTestQuestions(subject, count) {
  const prompt = `Generate exactly ${count} unique, high-quality multiple choice question(s) (MCQs) for the technical/academic subject: "${subject}".
Difficulty: medium.
Each question MUST have exactly 4 plausible option strings, a single correctOptionIndex (0, 1, 2, or 3), and a short explanation (1-2 sentences explaining why the correct answer is correct).
Return ONLY a JSON array of objects with this exact structure:
[
  {
    "questionText": "...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOptionIndex": 0,
    "explanation": "...",
    "difficulty": "medium"
  }
]
No markdown formatting, no code fences.`;

  let validQuestions = [];

  try {
    const generated = await callGeminiJSON(prompt);
    if (Array.isArray(generated)) {
      for (const item of generated) {
        if (
          item &&
          typeof item.questionText === "string" &&
          item.questionText.trim() &&
          Array.isArray(item.options) &&
          item.options.length === 4 &&
          typeof item.correctOptionIndex === "number" &&
          item.correctOptionIndex >= 0 &&
          item.correctOptionIndex <= 3
        ) {
          validQuestions.push({
            subject: subject.trim(),
            difficulty: item.difficulty || "medium",
            questionText: item.questionText.trim(),
            options: item.options.map((opt) => String(opt).trim()),
            correctOptionIndex: item.correctOptionIndex,
            explanation: typeof item.explanation === "string" ? item.explanation.trim() : null,
          });
        }
      }
    }
  } catch (llmErr) {
    console.warn(`[TEST MCQ GENERATION FALLBACK] Generating deterministic MCQs for "${subject}":`, llmErr.message);
  }

  // If Gemini failed or generated fewer than needed, backfill with deterministic bank
  if (validQuestions.length < count) {
    const needed = count - validQuestions.length;
    const fallbacks = getDeterministicQuestionsForSubject(subject, needed);
    validQuestions.push(...fallbacks);
  }

  if (validQuestions.length === 0) return [];

  try {
    const inserted = await TestQuestion.insertMany(validQuestions, {
      ordered: false,
    });
    return inserted;
  } catch (err) {
    if (err.insertedDocs && err.insertedDocs.length > 0) {
      return err.insertedDocs;
    }
    return validQuestions;
  }
}

/**
 * Helper to grade a session's questions and compute score and trust metrics.
 */
async function gradeSessionQuestions(session) {
  const questionIds = session.questions.map((q) => q.questionId);
  const originalQuestions = await TestQuestion.find({
    _id: { $in: questionIds },
  }).lean();

  const originalMap = new Map(
    originalQuestions.map((oq) => [oq._id.toString(), oq])
  );

  let correctCount = 0;
  for (const q of session.questions) {
    const original = originalMap.get(q.questionId.toString());
    if (
      original &&
      q.selectedIndex !== null &&
      q.selectedIndex !== undefined &&
      q.selectedIndex === original.correctOptionIndex
    ) {
      q.isCorrect = true;
      correctCount += 1;
    } else {
      q.isCorrect = false;
    }
  }

  const total = session.questions.length || 1;
  session.scorePercent = Math.round((correctCount / total) * 100);
}

/**
 * POST /api/test/start
 * Starts a 10-minute proctored MCQ test with 15 questions across 1-3 subjects.
 */
export const startTest = async (req, res, next) => {
  try {
    const { subjects, mode, questionCount } = req.body || {};

    if (
      !Array.isArray(subjects) ||
      subjects.length < 1 ||
      subjects.length > 3
    ) {
      return res
        .status(400)
        .json({ message: "Please select between 1 and 3 subjects." });
    }

    const cleanSubjects = subjects
      .map((s) => (typeof s === "string" ? s.trim().slice(0, 100) : ""))
      .filter((s) => s.length > 0);

    if (cleanSubjects.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one valid subject name is required." });
    }

    const isPractice = mode === "practice";
    const sessionMode = isPractice ? "practice" : "proctored";

    // Determine question count (defaults to 15, allows 5/10/15 for practice)
    let totalQuestions = 15;
    if (typeof questionCount === "number" && [5, 10, 15].includes(questionCount)) {
      totalQuestions = questionCount;
    }

    let countsPerSubject = [];
    if (cleanSubjects.length === 1) {
      countsPerSubject = [totalQuestions];
    } else if (cleanSubjects.length === 2) {
      const first = Math.ceil(totalQuestions / 2);
      const second = totalQuestions - first;
      countsPerSubject = [first, second];
    } else {
      const base = Math.floor(totalQuestions / 3);
      const remainder = totalQuestions % 3;
      countsPerSubject = [
        base + (remainder > 0 ? 1 : 0),
        base + (remainder > 1 ? 1 : 0),
        base,
      ];
    }

    let assembledQuestions = [];

    for (let i = 0; i < cleanSubjects.length; i++) {
      const subject = cleanSubjects[i];
      const needed = countsPerSubject[i];

      let bank = await TestQuestion.find({ subject }).lean();

      if (bank.length < needed) {
        const shortfall = needed - bank.length;
        await generateAndSaveTestQuestions(subject, shortfall);
        bank = await TestQuestion.find({ subject }).lean();
      }

      // If still fewer, generate generous batch
      if (bank.length < needed) {
        await generateAndSaveTestQuestions(subject, needed);
        bank = await TestQuestion.find({ subject }).lean();
      }

      const selected = bank.slice(0, needed);
      assembledQuestions.push(...selected);
    }

    if (assembledQuestions.length === 0) {
      return res
        .status(500)
        .json({ message: "Failed to assemble test questions. Please try again." });
    }

    const now = new Date();
    // Practice mode gets 2 hours (effectively untimed), proctored gets 10 minutes
    const expiresAt = isPractice
      ? new Date(now.getTime() + 2 * 60 * 60 * 1000)
      : new Date(now.getTime() + 10 * 60 * 1000);

    const sessionQuestions = assembledQuestions.map((q) => ({
      questionId: q._id,
      questionText: q.questionText,
      options: q.options,
      selectedIndex: null,
      isCorrect: null,
    }));

    const session = new TestSession({
      userId: req.userId,
      subjects: cleanSubjects,
      mode: sessionMode,
      status: "in-progress",
      startedAt: now,
      expiresAt,
      questions: sessionQuestions,
      violationCount: 0,
      trustScore: 100,
    });

    await session.save();

    // Strip correctOptionIndex completely so client receives zero answer leak
    const clientQuestions = session.questions.map((q) => ({
      _id: q._id,
      questionId: q.questionId,
      questionText: q.questionText,
      options: q.options,
      selectedIndex: q.selectedIndex,
    }));

    return res.status(201).json({
      sessionId: session._id,
      expiresAt: session.expiresAt,
      questions: clientQuestions,
      subjects: session.subjects,
      mode: session.mode,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/test/answer
 * Autosaves selected answer index for a question in an in-progress session.
 */
export const recordAnswer = async (req, res, next) => {
  try {
    const { sessionId, questionId, selectedIndex } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    if (!questionId || typeof questionId !== "string" || questionId.trim().length > 100) {
      return res.status(400).json({ message: "Invalid question id" });
    }

    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership tolerance check
    checkTestSessionOwner(session, req.userId);

    if (session.status !== "in-progress") {
      return res
        .status(400)
        .json({ message: "Test session is already finalized" });
    }

    const question = session.questions.find(
      (q) =>
        q._id.toString() === questionId ||
        q.questionId.toString() === questionId
    );

    if (question && typeof selectedIndex === "number" && selectedIndex >= 0 && selectedIndex <= 3) {
      question.selectedIndex = selectedIndex;
      await session.save();
    }

    return res.json({ message: "Answer saved" });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/test/violation
 * Increments proctoring violation count. Auto-submits test if violations reach 3.
 */
export const recordViolation = async (req, res, next) => {
  try {
    const { sessionId } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership tolerance check
    checkTestSessionOwner(session, req.userId);

    if (session.status !== "in-progress") {
      return res.json({ forceSubmit: true, result: session });
    }

    session.violationCount += 1;

    if (session.violationCount >= 3) {
      // Auto-submit immediately with trustScore = 0
      await gradeSessionQuestions(session);
      session.status = "auto-submitted";
      session.trustScore = 0;
      session.completedAt = new Date();
      await session.save();

      return res.json({
        forceSubmit: true,
        violationCount: session.violationCount,
        result: session,
      });
    }

    await session.save();

    return res.json({
      forceSubmit: false,
      violationCount: session.violationCount,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/test/submit
 * Finalizes test, grades answers, and computes final trust score based on violation count.
 */
export const submitTest = async (req, res, next) => {
  try {
    const { sessionId } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership tolerance check
    checkTestSessionOwner(session, req.userId);

    // If already finalized, return existing result idempotently
    if (session.status !== "in-progress") {
      return res.json({ result: session });
    }

    const now = new Date();
    // 5-second grace period past expiresAt
    if (now.getTime() > new Date(session.expiresAt).getTime() + 5000) {
      session.autoSubmittedByTimeout = true;
    }

    // Grade questions
    await gradeSessionQuestions(session);

    // Compute trustScore scale: 0 violations = 100, 1 = 70, 2 = 40, 3+ = 0
    if (session.violationCount === 0) {
      session.trustScore = 100;
    } else if (session.violationCount === 1) {
      session.trustScore = 70;
    } else if (session.violationCount === 2) {
      session.trustScore = 40;
    } else {
      session.trustScore = 0;
    }

    session.status = "completed";
    session.completedAt = now;
    await session.save();

    return res.json({ result: session });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/test/session/:id
 * Fetches full session details.
 */
export const getSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(id).lean();
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership tolerance check
    checkTestSessionOwner(session, req.userId);

    return res.json({ session });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/test/history
 * Fetches all past test sessions for current user.
 */
export const getHistory = async (req, res, next) => {
  try {
    const sessions = await TestSession.find({ userId: req.userId })
      .sort({ startedAt: -1 })
      .select(
        "subjects mode status scorePercent trustScore violationCount autoSubmittedByTimeout startedAt completedAt"
      )
      .lean();

    return res.json({ sessions });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/test/session/:id/detailed-report
 * Returns full detailed performance analytics, subject-wise accuracy, and wrong-question review.
 * Protected by ReportUnlock status: "paid" check. Returns 402 if not unlocked.
 */
export const getDetailedReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(id).lean();
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership tolerance check
    checkTestSessionOwner(session, req.userId);

    // Check if report has been unlocked via paid order
    const unlock = await ReportUnlock.findOne({
      userId: req.userId,
      testSessionId: id,
      status: "paid",
    }).lean();

    if (!unlock) {
      return res.status(402).json({
        message: "Detailed report requires unlock",
        unlocked: false,
      });
    }

    // Fetch original questions to extract correct answers and subjects
    const questionIds = session.questions.map((q) => q.questionId);
    const originalQuestions = await TestQuestion.find({
      _id: { $in: questionIds },
    }).lean();

    const originalMap = new Map(
      originalQuestions.map((oq) => [oq._id.toString(), oq])
    );

    // Subject breakdown
    const subjectStats = {};
    for (const sub of session.subjects || []) {
      subjectStats[sub] = { total: 0, correct: 0 };
    }

    const questionDetails = session.questions.map((q, idx) => {
      const oq = originalMap.get(q.questionId?.toString());
      const sub = oq?.subject || session.subjects[0] || "General";
      if (!subjectStats[sub]) subjectStats[sub] = { total: 0, correct: 0 };
      subjectStats[sub].total += 1;
      if (q.isCorrect) subjectStats[sub].correct += 1;

      return {
        index: idx + 1,
        questionText: q.questionText,
        options: q.options,
        selectedIndex: q.selectedIndex,
        selectedOptionText:
          q.selectedIndex !== null && q.options && q.options[q.selectedIndex]
            ? q.options[q.selectedIndex]
            : "Not Answered",
        correctOptionIndex: oq ? oq.correctOptionIndex : null,
        correctOptionText:
          oq && oq.options && oq.options[oq.correctOptionIndex]
            ? oq.options[oq.correctOptionIndex]
            : "",
        isCorrect: q.isCorrect,
        subject: sub,
      };
    });

    const subjectBreakdown = Object.keys(subjectStats).map((sub) => {
      const s = subjectStats[sub];
      return {
        subject: sub,
        total: s.total,
        correct: s.correct,
        accuracyPercent:
          s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      };
    });

    const wrongAnswers = questionDetails.filter((q) => !q.isCorrect);

    const weakAreas = subjectBreakdown
      .filter((s) => s.accuracyPercent < 70)
      .map((s) => `Revise ${s.subject} (Accuracy: ${s.accuracyPercent}%)`);

    if (weakAreas.length === 0) {
      weakAreas.push(
        "Strong performance across all tested subjects! Focus on speed and edge-case MCQs."
      );
    }

    return res.json({
      unlocked: true,
      report: {
        sessionId: session._id,
        subjects: session.subjects,
        scorePercent: session.scorePercent,
        trustScore: session.trustScore,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        totalQuestions: session.questions.length,
        correctCount: session.questions.filter((q) => q.isCorrect).length,
        subjectBreakdown,
        wrongAnswers,
        allQuestions: questionDetails,
        weakAreas,
        paidAt: unlock.paidAt,
        referenceCode: unlock.referenceCode,
      },
    });
  } catch (err) {
    next(err);
  }
};

