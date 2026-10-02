/**
 * server.js
 * ------------------------------------------------------
 * Express web server for the Cognitive Adaptive MCQ Testing Platform.
 * 
 * Features:
 * - Multi-Domain Technical Curriculum Roadmap (12 curated domains)
 * - Gradual 3-Question Adaptive Difficulty Progression (3 consecutive correct required to level up)
 * - Anti-Duplication Protection using Session Breakdown & String Similarity
 * - Coding-Flavored Questions with Code Separation (`hasCode`, `codeSnippet`)
 * - Sub-Topic Granular Tagging (`subTopic`) and Performance Tracking
 * - Progressive Thinking Hints (Benchmark + 30s)
 * - In-depth Cognitive Diagnostics & Remediation Plan
 */

import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateQuestion } from "./questionGenerator.js";
import { getSubtopicRoadmap } from "./questionBank.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Serve static frontend files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

/**
 * In-Memory Session Store
 */
const sessions = new Map();

/**
 * Curated Technical Domain Single Source of Truth
 */
export const ALLOWED_DOMAINS = [
  "JavaScript Programming",
  "Python Programming",
  "Java Programming",
  "C Programming Language",
  "C++ Programming Language",
  "Data Structures & Algorithms (DSA)",
  "Object-Oriented Programming (OOP) Concepts",
  "Operating Systems Concepts",
  "Computer Networks Concepts",
  "Database Management Systems (DBMS) & SQL",
  "Web Development Fundamentals (HTML, CSS, JavaScript Basics)",
  "Software Engineering Basics (SDLC, Version Control, etc.)"
];

/**
 * Route: GET /api/domains
 * Exposes the curated technical domain list for dynamic client usage.
 */
app.get("/api/domains", (req, res) => {
  return res.status(200).json({
    domains: ALLOWED_DOMAINS,
  });
});

/**
 * Computes the next adaptive difficulty level with gradual 3-question mastery requirement.
 * 
 * @param {string} currentDifficulty - "easy" | "medium" | "hard"
 * @param {boolean} wasCorrect - Whether the answer was correct
 * @param {number} tierStreak - Consecutive correct answers at current tier
 * @param {number} tierMisses - Consecutive misses at current tier
 * @returns {{ nextDifficulty: string, newStreak: number, newMisses: number, tierChanged: string }}
 */
function calculateGradualDifficulty(currentDifficulty, wasCorrect, tierStreak = 0, tierMisses = 0) {
  const levels = ["easy", "medium", "hard"];
  let currentIndex = levels.indexOf(currentDifficulty?.toLowerCase());
  if (currentIndex === -1) currentIndex = 1;

  if (wasCorrect) {
    const updatedStreak = tierStreak + 1;
    // Require 3 consecutive correct answers at current tier to level up
    if (updatedStreak >= 3 && currentIndex < levels.length - 1) {
      return {
        nextDifficulty: levels[currentIndex + 1],
        newStreak: 0,
        newMisses: 0,
        tierChanged: "promoted"
      };
    }
    return {
      nextDifficulty: levels[currentIndex],
      newStreak: updatedStreak,
      newMisses: 0,
      tierChanged: "none"
    };
  } else {
    const updatedMisses = tierMisses + 1;
    // Down-level if student misses 2 consecutive questions at current tier
    if (updatedMisses >= 2 && currentIndex > 0) {
      return {
        nextDifficulty: levels[currentIndex - 1],
        newStreak: 0,
        newMisses: 0,
        tierChanged: "demoted"
      };
    }
    return {
      nextDifficulty: levels[currentIndex],
      newStreak: 0,
      newMisses: updatedMisses,
      tierChanged: "none"
    };
  }
}

/**
 * Categorizes response into cognitive diagnostic state.
 */
function evaluateCognitiveState(wasCorrect, timeSpentSeconds, benchmarkSeconds = 30) {
  const time = Math.max(1, Math.round(timeSpentSeconds));
  const bench = Math.max(10, benchmarkSeconds);

  if (wasCorrect) {
    if (time <= Math.min(18, bench * 0.75)) {
      return {
        type: "mastered",
        label: "Fluent Mastery",
        badgeClass: "diag-mastered",
        icon: "⚡",
        description: `Fast & accurate (${time}s vs ${bench}s benchmark). High conceptual fluency.`
      };
    } else if (time > bench + 25) {
      const delta = time - bench;
      return {
        type: "hesitant",
        label: `Cognitive Drag (+${delta}s)`,
        badgeClass: "diag-hesitant",
        icon: "⏳",
        description: `Correct, but required ${time}s (+${delta}s over target). Practice speed reinforcement.`
      };
    } else {
      return {
        type: "solid",
        label: "Solid Understanding",
        badgeClass: "diag-solid",
        icon: "✓",
        description: `Accurate and on-pace with benchmark (${time}s vs ${bench}s target).`
      };
    }
  } else {
    if (time <= 12) {
      return {
        type: "impulsive",
        label: "Impulsive Trap",
        badgeClass: "diag-impulsive",
        icon: "🚨",
        description: `Rushed answer in ${time}s and fell for a common distractor trap.`
      };
    } else if (time > bench + 25) {
      const delta = time - bench;
      return {
        type: "gap",
        label: `Critical Skill Gap (+${delta}s)`,
        badgeClass: "diag-gap",
        icon: "🛑",
        description: `Struggled for ${time}s (+${delta}s over benchmark) and answered incorrectly.`
      };
    } else {
      return {
        type: "misconception",
        label: "Concept Misconception",
        badgeClass: "diag-misconception",
        icon: "✗",
        description: `Answered incorrectly within standard time (${time}s vs ${bench}s target).`
      };
    }
  }
}

/**
 * Generates personalized remediation recommendations.
 */
function generateRecommendations(breakdown, topic) {
  const weakConcepts = new Set();
  const slowConcepts = [];
  let totalTime = 0;
  let totalBenchmark = 0;

  breakdown.forEach((item) => {
    totalTime += item.timeSpentSeconds || 20;
    totalBenchmark += item.benchmarkSeconds || 30;

    const topicLabel = item.subTopic || item.conceptTag;
    if (!item.wasCorrect && topicLabel) {
      weakConcepts.add(topicLabel);
    }

    if (item.timeSpentSeconds > (item.benchmarkSeconds || 30) + 20 && topicLabel) {
      slowConcepts.push({
        concept: topicLabel,
        actual: item.timeSpentSeconds,
        target: item.benchmarkSeconds || 30,
        delta: item.timeSpentSeconds - (item.benchmarkSeconds || 30)
      });
    }
  });

  const recs = [];

  if (weakConcepts.size > 0) {
    recs.push(`**Targeted Concept Review**: Focus your revision on **${Array.from(weakConcepts).slice(0, 4).join(", ")}**.`);
  }

  if (slowConcepts.length > 0) {
    const slowDetails = slowConcepts.slice(0, 3).map(s => `${s.concept} (+${s.delta}s)`).join(", ");
    recs.push(`**Cognitive Retrieval Speed**: You took longer than the target benchmark in: **${slowDetails}**. Drill these subtopics to build fluency.`);
  }

  const avgDelta = Math.round((totalTime - totalBenchmark) / Math.max(1, breakdown.length));
  if (avgDelta > 10) {
    recs.push(`Overall pace was **${avgDelta}s slower per question** than standardized benchmarks. Focus on identifying core domain relationships quickly.`);
  } else if (avgDelta < -8 && weakConcepts.size > 0) {
    recs.push(`You answered quickly on several questions. Take a moment to eliminate plausible distractor traps before submitting.`);
  }

  if (recs.length === 0) {
    recs.push(`🏆 **Exceptional Mastery**: Flawless conceptual accuracy and optimal pacing across all subtopics in **${topic}**!`);
  }

  return recs;
}

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    engine: "cognitive-adaptive-multi-domain",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("your-key")),
    activeSessions: sessions.size,
  });
});

/**
 * Route: POST /api/test/start
 */
app.post("/api/test/start", async (req, res) => {
  try {
    const {
      topic,
      numQuestions = 10,
      startDifficulty = "easy",
      excludeQuestions = []
    } = req.body;

    // Server-side validation: submitted topic must strictly match one of the curated allowed domains
    if (!topic || typeof topic !== "string" || !ALLOWED_DOMAINS.includes(topic.trim())) {
      return res.status(400).json({
        error: true,
        message: "Please select a valid topic from the dropdown list.",
      });
    }

    const parsedNumQuestions = Math.min(
      Math.max(parseInt(numQuestions, 10) || 10, 1),
      35
    );

    const initialDifficulty = ["easy", "medium", "hard"].includes(startDifficulty?.toLowerCase())
      ? startDifficulty.toLowerCase()
      : "easy";

    const sessionId = randomUUID();
    const sessionExcludes = Array.isArray(excludeQuestions) ? [...excludeQuestions] : [];
    const usedClusters = [];

    // Build structured curriculum roadmap for the session
    const subtopicRoadmap = getSubtopicRoadmap(topic.trim(), parsedNumQuestions);
    const firstSubtopic = subtopicRoadmap[0] || topic.trim();

    // Generate Question 1 for the first subtopic passing previous questions list
    const firstQuestion = await generateQuestion(
      topic.trim(),
      initialDifficulty,
      sessionExcludes,
      usedClusters,
      firstSubtopic
    );

    sessionExcludes.push(firstQuestion.question);
    if (firstQuestion.subCluster) usedClusters.push(firstQuestion.subCluster);

    const subTopicValue = firstQuestion.subTopic || firstQuestion.conceptTag || firstSubtopic;

    const session = {
      id: sessionId,
      topic: topic.trim(),
      numQuestions: parsedNumQuestions,
      currentQuestionIndex: 1,
      currentDifficulty: firstQuestion.difficulty || initialDifficulty,
      tierStreak: 0,
      tierMisses: 0,
      subtopicRoadmap: subtopicRoadmap,
      score: 0,
      currentQuestion: firstQuestion,
      usedQuestions: sessionExcludes,
      usedClusters: usedClusters,
      difficultyProgression: [firstQuestion.difficulty || initialDifficulty],
      breakdown: [],
      finished: false,
      createdAt: new Date(),
    };

    sessions.set(sessionId, session);

    return res.status(200).json({
      sessionId: session.id,
      questionNumber: 1,
      totalQuestions: session.numQuestions,
      difficulty: session.currentDifficulty,
      tierStreak: session.tierStreak,
      nextTierThreshold: 3,
      question: firstQuestion.question,
      hasCode: Boolean(firstQuestion.hasCode),
      codeSnippet: firstQuestion.codeSnippet || "",
      subTopic: subTopicValue,
      options: firstQuestion.options,
      conceptTag: subTopicValue,
      targetSubtopic: firstSubtopic,
      subtopicRoadmap: subtopicRoadmap,
      approachHint: firstQuestion.approachHint || `Analyze the foundational relationships and core principles of ${firstSubtopic}.`,
      subCluster: firstQuestion.subCluster || "general",
      benchmarkSeconds: firstQuestion.benchmarkSeconds || 25,
      isFallback: Boolean(firstQuestion.isFallback),
    });
  } catch (err) {
    console.error("[/api/test/start Error]:", err);
    return res.status(500).json({
      error: err.message || "Failed to start test session. Please try again.",
    });
  }
});

/**
 * Route: POST /api/test/answer
 */
app.post("/api/test/answer", async (req, res) => {
  try {
    const { sessionId, selectedAnswer, timeSpentSeconds = 20 } = req.body;

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(404).json({
        error: "Session not found or expired. Please start a new test.",
      });
    }

    const session = sessions.get(sessionId);

    if (session.finished) {
      return res.status(400).json({
        error: "This test session has already been completed.",
      });
    }

    if (typeof selectedAnswer !== "string" || selectedAnswer.trim().length === 0) {
      return res.status(400).json({
        error: "Please provide a valid selectedAnswer.",
      });
    }

    const currentQ = session.currentQuestion;
    const wasCorrect = selectedAnswer.trim() === currentQ.correctAnswer.trim();
    const cleanTime = Math.max(1, Math.round(Number(timeSpentSeconds) || 20));
    const benchmarkTime = currentQ.benchmarkSeconds || 30;

    if (wasCorrect) {
      session.score += 1;
    }

    const cognitiveDiag = evaluateCognitiveState(
      wasCorrect,
      cleanTime,
      benchmarkTime
    );

    const timeDelta = cleanTime - benchmarkTime;
    const subTopicValue = currentQ.subTopic || currentQ.conceptTag || "Core Concept";

    // Record question, subTopic, correctness, and metrics in breakdown array
    const resultEntry = {
      questionNumber: session.currentQuestionIndex,
      question: currentQ.question,
      subTopic: subTopicValue,
      hasCode: Boolean(currentQ.hasCode),
      codeSnippet: currentQ.codeSnippet || "",
      yourAnswer: selectedAnswer.trim(),
      correctAnswer: currentQ.correctAnswer,
      wasCorrect: wasCorrect,
      explanation: currentQ.explanation,
      difficulty: currentQ.difficulty || session.currentDifficulty,
      conceptTag: subTopicValue,
      subCluster: currentQ.subCluster || "general",
      approachHint: currentQ.approachHint || "",
      timeSpentSeconds: cleanTime,
      benchmarkSeconds: benchmarkTime,
      timeDelta: timeDelta,
      cognitiveDiagnosis: cognitiveDiag,
    };
    session.breakdown.push(resultEntry);

    const isLastQuestion = session.currentQuestionIndex >= session.numQuestions;

    if (isLastQuestion) {
      session.finished = true;

      const conceptMap = {};
      const cognitiveSummary = {
        mastered: 0,
        solid: 0,
        hesitant: 0,
        impulsive: 0,
        skillGaps: 0,
      };

      session.breakdown.forEach((item) => {
        const tag = item.subTopic || item.conceptTag || "General";
        if (!conceptMap[tag]) {
          conceptMap[tag] = { total: 0, correct: 0, totalTime: 0, totalBenchmark: 0 };
        }
        conceptMap[tag].total += 1;
        conceptMap[tag].totalTime += item.timeSpentSeconds;
        conceptMap[tag].totalBenchmark += item.benchmarkSeconds;
        if (item.wasCorrect) conceptMap[tag].correct += 1;

        if (item.cognitiveDiagnosis.type === "mastered") cognitiveSummary.mastered += 1;
        else if (item.cognitiveDiagnosis.type === "solid") cognitiveSummary.solid += 1;
        else if (item.cognitiveDiagnosis.type === "hesitant") cognitiveSummary.hesitant += 1;
        else if (item.cognitiveDiagnosis.type === "impulsive") cognitiveSummary.impulsive += 1;
        else cognitiveSummary.skillGaps += 1;
      });

      const conceptMatrix = Object.entries(conceptMap).map(([concept, data]) => ({
        concept,
        total: data.total,
        correct: data.correct,
        accuracy: Math.round((data.correct / data.total) * 100),
        avgTime: Math.round(data.totalTime / data.total),
        avgBenchmark: Math.round(data.totalBenchmark / data.total),
      }));

      const recommendations = generateRecommendations(session.breakdown, session.topic);

      return res.status(200).json({
        finished: true,
        score: session.score,
        totalQuestions: session.numQuestions,
        wasCorrect: wasCorrect,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
        subTopic: subTopicValue,
        conceptTag: subTopicValue,
        hasCode: Boolean(currentQ.hasCode),
        codeSnippet: currentQ.codeSnippet || "",
        approachHint: currentQ.approachHint,
        timeSpentSeconds: cleanTime,
        benchmarkSeconds: benchmarkTime,
        timeDelta: timeDelta,
        cognitiveDiagnosis: cognitiveDiag,
        breakdown: session.breakdown,
        difficultyProgression: session.difficultyProgression,
        conceptMatrix: conceptMatrix,
        cognitiveSummary: cognitiveSummary,
        recommendations: recommendations,
      });
    }

    // Gradual adaptive stepping: update tier streaks & compute next difficulty
    const { nextDifficulty, newStreak, newMisses } = calculateGradualDifficulty(
      session.currentDifficulty,
      wasCorrect,
      session.tierStreak,
      session.tierMisses
    );

    session.currentDifficulty = nextDifficulty;
    session.tierStreak = newStreak;
    session.tierMisses = newMisses;
    session.currentQuestionIndex += 1;
    session.difficultyProgression.push(nextDifficulty);

    // Pick target subtopic for the next question from curriculum roadmap
    const nextSubtopicIndex = session.currentQuestionIndex - 1;
    const nextSubtopic = session.subtopicRoadmap[nextSubtopicIndex % session.subtopicRoadmap.length] || session.topic;

    // Collect all previously asked question texts from session breakdown for anti-duplication
    const previousQuestions = session.breakdown.map((item) => item.question).filter(Boolean);
    if (Array.isArray(session.usedQuestions)) {
      session.usedQuestions.forEach((q) => {
        if (q && !previousQuestions.includes(q)) {
          previousQuestions.push(q);
        }
      });
    }

    // Generate next question with previousQuestions passed for prompt deduplication and safety-net check
    const nextQuestion = await generateQuestion(
      session.topic,
      nextDifficulty,
      previousQuestions,
      session.usedClusters,
      nextSubtopic
    );

    session.currentQuestion = nextQuestion;
    session.usedQuestions.push(nextQuestion.question);
    if (nextQuestion.subCluster) session.usedClusters.push(nextQuestion.subCluster);

    const nextSubTopicValue = nextQuestion.subTopic || nextQuestion.conceptTag || nextSubtopic;

    return res.status(200).json({
      finished: false,
      questionNumber: session.currentQuestionIndex,
      totalQuestions: session.numQuestions,
      difficulty: session.currentDifficulty,
      tierStreak: session.tierStreak,
      nextTierThreshold: 3,
      question: nextQuestion.question,
      hasCode: Boolean(nextQuestion.hasCode),
      codeSnippet: nextQuestion.codeSnippet || "",
      subTopic: nextSubTopicValue,
      options: nextQuestion.options,
      conceptTag: nextSubTopicValue,
      targetSubtopic: nextSubtopic,
      subtopicRoadmap: session.subtopicRoadmap,
      approachHint: nextQuestion.approachHint || `Consider the structural and functional principles of ${nextSubtopic}.`,
      subCluster: nextQuestion.subCluster || "general",
      benchmarkSeconds: nextQuestion.benchmarkSeconds || 30,
      isFallback: Boolean(nextQuestion.isFallback),
      wasCorrect: wasCorrect,
      correctAnswer: currentQ.correctAnswer,
      explanation: currentQ.explanation,
      timeSpentSeconds: cleanTime,
      timeDelta: timeDelta,
      cognitiveDiagnosis: cognitiveDiag,
    });
  } catch (err) {
    console.error("[/api/test/answer Error]:", err);
    return res.status(500).json({
      error: err.message || "Failed to process answer. Please try again.",
    });
  }
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the HTTP server when run directly
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isMainModule) {
  app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`  Adaptive MCQ Testing Platform            `);
    console.log(`  Server running at: http://localhost:${PORT}`);
    console.log(`===========================================`);
  });
}

export { app };
