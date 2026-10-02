/**
 * questionGenerator.js
 * ------------------------------------------------------
 * Google Gemini AI Question Generator & Adaptive Engine.
 * 
 * Capabilities:
 * - Multi-Style AI Generation (Pure Theory, Code Output, Bug Hunt, Fill-in-the-Blank).
 * - Code-Flavor Domain Specialization (JS, Python, Java, C, C++, DSA, OOP, DBMS/SQL, Web Dev).
 * - Multi-Domain Question Bank (Curated Technical Domains + Procedural Synthesis).
 * - Automatic Exponential Backoff Retries on 429 Rate Limits / RESOURCE_EXHAUSTED.
 * - Session Anti-Duplication & String-Similarity Safety Net.
 * - Sub-Topic Granular Tagging (`subTopic`) for Cognitive Tracking.
 * - Distinct Code Snippet Schema (`hasCode: boolean`, `codeSnippet: string`).
 * - Strict Option Length Balancing & Shuffling.
 */

import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateQuestion, isQuestionDuplicate, normalizeQuestionText, calculateSimilarity } from "./validator.js";
import { findTopicBank, generateProceduralQuestion } from "./questionBank.js";

// Export anti-duplication helpers for convenience
export { isQuestionDuplicate, normalizeQuestionText, calculateSimilarity };

// Provider state tracking
let geminiQuotaExhausted = false;

// Initialize Gemini client if key is configured
let geminiClient = null;
if (
  process.env.GEMINI_API_KEY &&
  !process.env.GEMINI_API_KEY.includes("your-key") &&
  !process.env.GEMINI_API_KEY.includes("your_key")
) {
  geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Async sleep utility for exponential backoff delays.
 * @param {number} ms 
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fisher-Yates array shuffler.
 * Returns a new array with elements in randomized order.
 * @param {Array} array 
 * @returns {Array}
 */
export function shuffleOptions(array) {
  if (!Array.isArray(array)) return [];
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Determines whether a domain supports code/query-based question styles.
 * 
 * Code-applicable domains:
 * - JavaScript
 * - Python
 * - Java
 * - C
 * - C++
 * - Data Structures & Algorithms (DSA)
 * - Object-Oriented Programming (OOP)
 * - Web Development Fundamentals
 * - Database Management Systems (DBMS) / SQL (query-based questions)
 * 
 * Non-code domains (pure theoretical):
 * - Operating Systems
 * - Computer Networks
 * - Software Engineering Basics
 * 
 * @param {string} topic 
 * @returns {boolean}
 */
export function isCodeApplicableDomain(topic = "") {
  const t = (topic || "").toLowerCase().trim();
  if (!t) return false;

  // Explicit theoretical domains that must remain pure theory
  if (
    t.includes("operating system") ||
    t.includes("computer network") ||
    t.includes("software engineering")
  ) {
    return false;
  }

  const codePatterns = [
    "javascript",
    "python",
    "java",
    "c++",
    "cpp",
    "c programming",
    "c language",
    "data structures",
    "dsa",
    "algorithms",
    "object-oriented",
    "oop",
    "web development",
    "html",
    "css",
    "database management",
    "dbms",
    "sql"
  ];

  if (t === "c" || t.startsWith("c ") || t.endsWith(" c") || t.includes("c programming") || t.includes("c language")) {
    return true;
  }

  return codePatterns.some((pattern) => t.includes(pattern));
}

/**
 * Builds the prompt sent to AI models for misconception-first question generation
 * with curriculum subtopic targeting, code-flavored variety, and anti-duplication constraints.
 * 
 * @param {string} topic 
 * @param {string} difficulty 
 * @param {string[]} [previousQuestions=[]] 
 * @param {string[]} [usedClusters=[]] 
 * @param {string} [targetSubtopic=""] 
 * @param {string} [forcedStyle=null]
 * @returns {string}
 */
export function buildPrompt(
  topic,
  difficulty = "medium",
  previousQuestions = [],
  usedClusters = [],
  targetSubtopic = "",
  forcedStyle = null,
  targetMisconception = ""
) {
  const cleanPrevious = Array.isArray(previousQuestions) ? previousQuestions.filter(Boolean) : [];
  const antiDuplicationDirective =
    cleanPrevious.length > 0
      ? `\nPREVIOUSLY ASKED QUESTIONS IN THIS TEST SESSION (DO NOT REPEAT):\n${cleanPrevious
        .map((q, idx) => `${idx + 1}. "${q}"`)
        .join("\n")}\nCRITICAL ANTI-DUPLICATION RULE: Do not repeat, closely rephrase, or ask a near-identical variant of any of the following previously asked questions in this test: [${cleanPrevious.map(q => `"${q}"`).join(", ")}]. Generate a completely unique, novel question on a different sub-concept!\n`
      : "";

  const subtopicDirective = targetSubtopic
    ? `\nTarget Curriculum Sub-Domain: "${targetSubtopic}". The question MUST specifically test concepts within this sub-domain under "${topic}".\n`
    : "";

  const misconceptionDirective = targetMisconception
    ? `\nTARGET MISCONCEPTION TO TEST & DIAGNOSE:\n"${targetMisconception}"\nCRITICAL MISCONCEPTION RULE: You MUST construct this question, the single correct answer, and distractors specifically around this chosen student misconception. At least one distractor MUST directly represent the trap a student with this misconception would fall into.\n`
    : "";

  const clusterText =
    usedClusters.length > 0 && !targetSubtopic
      ? `\nFocus on an untested sub-domain of "${topic}" that differs from these previously tested areas: ${usedClusters.join(", ")}.\n`
      : "";

  // Determine question style
  const codeApplicable = isCodeApplicableDomain(topic);
  let styleInstruction = "";

  if (codeApplicable) {
    const availableStyles = ["pure_theory", "code_output", "code_bug", "fill_blank"];
    const chosenStyle = forcedStyle || availableStyles[Math.floor(Math.random() * availableStyles.length)];

    if (chosenStyle === "code_output") {
      styleInstruction = `
QUESTION STYLE DIRECTIVE: "What is the output of this code?"
- Include a realistic, self-contained, 3 to 10 line code snippet in "${topic}" (or SQL query for DBMS/SQL).
- In the "question" text, ask what the code outputs, returns, prints, or evaluates to.
- Set "hasCode": true.
- Put ONLY the clean code snippet into the "codeSnippet" field (separate from the question text).
- Provide 4 plausible output values or error behaviors as options.
`;
    } else if (chosenStyle === "code_bug") {
      styleInstruction = `
QUESTION STYLE DIRECTIVE: "Which line contains a bug?"
- Include a short 3 to 10 line code snippet in "${topic}" (or SQL query for DBMS/SQL) containing an intentional subtle logical flaw, edge-case bug, or syntax issue.
- In the "question" text, ask which line/statement contains the flaw or describe the bug.
- Set "hasCode": true.
- Put ONLY the clean code snippet (with clear identifiable lines) into the "codeSnippet" field.
- Provide 4 options pointing to specific lines or describing the bug accurately.
`;
    } else if (chosenStyle === "fill_blank") {
      styleInstruction = `
QUESTION STYLE DIRECTIVE: "Fill in the blank"
- Include a short 3 to 10 line code snippet in "${topic}" (or SQL query for DBMS/SQL) with a missing blank placeholder denoted by "____" or "/* blank */".
- In the "question" text, ask which expression or statement correctly completes the code snippet to achieve the intended behavior.
- Set "hasCode": true.
- Put ONLY the code snippet into the "codeSnippet" field.
- Provide 4 candidate code expressions as options.
`;
    } else {
      styleInstruction = `
QUESTION STYLE DIRECTIVE: Pure Theory / Conceptual Question
- Write an insightful theoretical question on the underlying mechanism, syntax rule, memory model, or algorithmic principle.
- Set "hasCode": false.
- Set "codeSnippet": "".
`;
    }
  } else {
    styleInstruction = `
QUESTION STYLE DIRECTIVE: Pure Theory / Conceptual Question
- This discipline ("${topic}") is purely theoretical. Write a conceptual question without programming code snippets.
- Set "hasCode": false.
- Set "codeSnippet": "".
`;
  }

  return `
You are an expert psychometric exam question writer creating a diagnostic multiple-choice question (MCQ)
for a student skill-assessment test in the subject/discipline of "${topic}".

Topic: ${topic}
${subtopicDirective}${misconceptionDirective}${clusterText}${antiDuplicationDirective}
Difficulty level: ${difficulty} (must be one of: easy, medium, hard)

${styleInstruction}

Follow these STRICT rules:
1. ${targetMisconception ? `TARGET MISCONCEPTION: Base the question directly on diagnosing this misconception: "${targetMisconception}". Ensure at least one distractor is the exact trap caused by this misconception.` : `Identify ONE genuine conceptual misconception, trap, or subtle principle students struggle with in "${topic}" (specifically "${targetSubtopic || topic}") at the "${difficulty}" level.`}
2. SUB-TOPIC IDENTIFICATION: Include a "subTopic" field identifying the specific sub-topic the question covers within "${topic}" (e.g., for DSA: "Arrays", "Trees", "Graphs", "Sorting", "Dynamic Programming"; for DBMS/SQL: "Normalization", "Transactions & ACID", "Joins", "Indexing", "Aggregate Functions"; for JS: "Closures", "Event Loop", "Promises", "Prototypes", etc.). Choose an appropriate, concise, and consistent sub-topic label.
3. Write a clear, unambiguous question prompt.
4. CODE SEPARATION RULE: If a code snippet is used, set "hasCode": true and put the code in "codeSnippet". NEVER embed the code block inside the "question" string if "hasCode" is true. If no code snippet is used, set "hasCode": false and "codeSnippet": "".
5. Write the single correct answer.
6. Write 3 plausible wrong answer options ("distractors") that reflect common student misconceptions in "${topic}".
7. CRITICAL LENGTH BALANCING RULE: All 4 options MUST have approximately the EXACT same length, grammatical structure, and level of detail (within ±10% character count). NEVER make the correct answer noticeably longer or more descriptive than the distractors.
8. Provide an "approachHint": A pedagogical thinking prompt (1-2 sentences) giving strategic direction or mental models if stuck. DO NOT reveal the correct option text or letter!
9. Provide a realistic benchmark solve time in seconds (e.g. 20 for easy, 30 for medium, 45 for hard).

Respond ONLY with valid, raw JSON (no markdown fences, no extra text):
{
  "question": "string (the question prompt text)",
  "hasCode": ${codeApplicable ? "true or false" : "false"},
  "codeSnippet": "string (clean code snippet if hasCode is true, otherwise empty string)",
  "subTopic": "${targetSubtopic || "Specific Subtopic Name"}",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string (must exactly match one of the options)",
  "explanation": "string (detailed conceptual explanation)",
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "conceptTag": "${targetSubtopic || "Specific Subtopic Name"}",
  "subCluster": "${(targetSubtopic || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '_')}",
  "approachHint": "string (guiding thought prompt without revealing the answer)",
  "benchmarkSeconds": 30
}
`.trim();
}

/**
 * Generates a local fallback question prioritizing target subtopic and untested clusters.
 * 
 * @param {string} topic 
 * @param {string} difficulty 
 * @param {string[]} previousQuestions 
 * @param {string[]} usedClusters 
 * @param {string} targetSubtopic 
 * @returns {Object} Valid question object with isFallback: true
 */
export function generateLocalQuestion(
  topic,
  difficulty = "medium",
  previousQuestions = [],
  usedClusters = [],
  targetSubtopic = ""
) {
  const diff = ["easy", "medium", "hard"].includes(difficulty?.toLowerCase())
    ? difficulty.toLowerCase()
    : "medium";

  const bank = findTopicBank(topic);
  const normalizedExcludes = new Set(
    (previousQuestions || []).map((q) => (q || "").trim().toLowerCase())
  );
  const usedClusterSet = new Set(usedClusters.map((c) => (c || "").toLowerCase()));

  let rawQuestion = null;

  if (bank) {
    // 1. Target difficulty pool
    const targetPool = (bank[diff] || []).filter(
      (q) => !normalizedExcludes.has(q.question.trim().toLowerCase()) &&
             !isQuestionDuplicate(q.question, previousQuestions)
    );

    // Filter by target subtopic or subCluster if specified
    if (targetSubtopic) {
      const subtopicClean = targetSubtopic.toLowerCase();
      const matchedInTarget = targetPool.filter(
        (q) => (q.conceptTag && q.conceptTag.toLowerCase().includes(subtopicClean)) ||
               (q.subTopic && q.subTopic.toLowerCase().includes(subtopicClean)) ||
               (q.subCluster && subtopicClean.includes(q.subCluster.toLowerCase()))
      );
      if (matchedInTarget.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchedInTarget.length);
        rawQuestion = { ...matchedInTarget[randomIndex], topic: topic.trim() };
      }
    }

    if (!rawQuestion) {
      const unusedClusterPool = targetPool.filter(
        (q) => q.subCluster && !usedClusterSet.has(q.subCluster.toLowerCase())
      );

      if (unusedClusterPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * unusedClusterPool.length);
        rawQuestion = { ...unusedClusterPool[randomIndex], topic: topic.trim() };
      } else if (targetPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * targetPool.length);
        rawQuestion = { ...targetPool[randomIndex], topic: topic.trim() };
      } else {
        // Fallback to other difficulty levels in same bank
        const otherLevels = ["easy", "medium", "hard"].filter((l) => l !== diff);
        for (const lvl of otherLevels) {
          const altPool = (bank[lvl] || []).filter(
            (q) => !normalizedExcludes.has(q.question.trim().toLowerCase()) &&
                   !isQuestionDuplicate(q.question, previousQuestions)
          );
          if (altPool.length > 0) {
            const randomIndex = Math.floor(Math.random() * altPool.length);
            rawQuestion = { ...altPool[randomIndex], topic: topic.trim() };
            break;
          }
        }
      }
    }
  }

  // 2. Domain-Aware Procedural Generator for custom/unlisted topics
  if (!rawQuestion) {
    let seed = previousQuestions.length + Math.floor(Math.random() * 8);
    for (let attempt = 0; attempt < 15; attempt++) {
      const procedural = generateProceduralQuestion(topic, diff, seed + attempt, targetSubtopic);
      if (
        !normalizedExcludes.has(procedural.question.trim().toLowerCase()) &&
        !isQuestionDuplicate(procedural.question, previousQuestions)
      ) {
        rawQuestion = procedural;
        break;
      }
    }

    if (!rawQuestion) {
      rawQuestion = generateProceduralQuestion(topic, diff, Date.now(), targetSubtopic);
    }
  }

  const defaultBenchmark = diff === "easy" ? 20 : diff === "medium" ? 30 : 45;
  const determinedSubtopic = rawQuestion.subTopic || rawQuestion.conceptTag || targetSubtopic || "Core Concept";

  return {
    ...rawQuestion,
    subTopic: determinedSubtopic,
    conceptTag: determinedSubtopic,
    subCluster: rawQuestion.subCluster || "general",
    approachHint: rawQuestion.approachHint || `Consider the core principles and functional relationships of ${determinedSubtopic}.`,
    benchmarkSeconds: rawQuestion.benchmarkSeconds || rawQuestion.expectedSeconds || defaultBenchmark,
    options: shuffleOptions(rawQuestion.options),
    hasCode: Boolean(rawQuestion.hasCode),
    codeSnippet: typeof rawQuestion.codeSnippet === "string" ? rawQuestion.codeSnippet : "",
    isFallback: true,
  };
}

/**
 * Explicit alias for fallback question generator
 */
export const generateFallbackQuestion = generateLocalQuestion;

/**
 * Toggle for the multi-step self-reflective generation pipeline.
 * Set to false (or process.env.USE_MULTISTEP_PIPELINE = "false") to revert to single-shot generation.
 */
export const USE_MULTISTEP_PIPELINE = process.env.USE_MULTISTEP_PIPELINE !== "false";

/**
 * Builds the prompt for Step 1: Misconception Identification.
 * Asks the AI to identify 2-3 distinct student misconceptions, reason about which is most diagnostically useful,
 * and select exactly one.
 * 
 * @param {string} topic 
 * @param {string} difficulty 
 * @param {string} [targetSubtopic=""] 
 * @returns {string}
 */
export function buildMisconceptionPrompt(topic, difficulty = "medium", targetSubtopic = "") {
  const subtopicText = targetSubtopic ? `specifically within the sub-topic "${targetSubtopic}"` : "";
  return `
You are an expert diagnostic exam author in "${topic}".
Task: Identify 2-3 distinct common misconceptions, false assumptions, or typical student mistakes in "${topic}" ${subtopicText} at the "${difficulty}" difficulty level.

Reason about which one of these misconceptions would make the most diagnostically useful and insightful multiple-choice question to test student mastery at this difficulty level, and select exactly one as "chosenMisconception".

Respond ONLY with valid, raw JSON (no markdown fences, no extra text):
{
  "misconceptions": [
    "string (first common misconception)",
    "string (second common misconception)",
    "string (third common misconception)"
  ],
  "chosenMisconception": "string (the single chosen misconception from above)",
  "reasoning": "string (one concise sentence explaining why this misconception is the most diagnostically useful to test at the ${difficulty} level)"
}
`.trim();
}

/**
 * Builds the prompt for Step 3: Self-Critique.
 * Asks the AI to evaluate its own draft against psychometric quality and correctness criteria.
 * 
 * @param {string} topic 
 * @param {string} difficulty 
 * @param {Object} draftQuestion 
 * @param {string} [chosenMisconception=""] 
 * @returns {string}
 */
export function buildCritiquePrompt(topic, difficulty, draftQuestion, chosenMisconception = "") {
  return `
You are a rigorous psychometric exam reviewer and senior subject matter expert in "${topic}".
Critically evaluate the following draft multiple-choice question designed for "${difficulty}" difficulty.

${chosenMisconception ? `Target Misconception Being Tested:\n"${chosenMisconception}"\n` : ""}
Draft Question Under Review:
${JSON.stringify(draftQuestion, null, 2)}

Review Checklist:
1. Is the correct answer ("${draftQuestion.correctAnswer}") 100% factually accurate, unambiguous, and demonstrably true?
2. Are all 3 distractors genuinely plausible to someone with incomplete understanding (not trivially obvious or silly)?
${chosenMisconception ? `3. Does at least one distractor directly reflect the target misconception ("${chosenMisconception}")?\n` : "3. Do the distractors reflect realistic conceptual traps?\n"}4. Is the question prompt clearly worded with zero ambiguity?
5. If "hasCode" is true, is the code snippet valid, self-contained, and does it produce the exact behavior/output described in the answer and explanation?
6. Are all 4 options balanced in length, style, and grammatical structure (within ±10% character count)?

If the draft is completely sound and meets every checklist item, approve it.
If the draft has any flaw (ambiguity, weak distractors, code bug, length imbalance, or inaccurate explanation), do NOT approve it. Provide a fully revised and corrected question object.

Respond ONLY with valid, raw JSON (no markdown fences, no extra text):
If approved:
{
  "approved": true
}

If not approved / revised:
{
  "approved": false,
  "critiqueNotes": "string (brief note explaining what was flawed and what was revised)",
  "revisedQuestion": {
    "question": "string (the revised question prompt)",
    "hasCode": ${draftQuestion.hasCode ? "true" : "false"},
    "codeSnippet": "string (clean code snippet if hasCode is true, else empty string)",
    "subTopic": "${draftQuestion.subTopic || topic}",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": "string (must exactly match one of the 4 options)",
    "explanation": "string (detailed conceptual explanation)",
    "difficulty": "${difficulty}",
    "topic": "${topic}",
    "conceptTag": "${draftQuestion.conceptTag || draftQuestion.subTopic || topic}",
    "subCluster": "${draftQuestion.subCluster || "general"}",
    "approachHint": "string (pedagogical hint without revealing the answer)",
    "benchmarkSeconds": ${draftQuestion.benchmarkSeconds || 30}
  }
}
`.trim();
}

/**
 * Low-level executor for Gemini prompts with exponential backoff on 429/rate-limit errors.
 * 
 * @param {string} prompt 
 * @param {number} [temperature=0.7] 
 * @param {string} [stepName="Gemini API"] 
 * @returns {Promise<Object>}
 */
async function executeGeminiPrompt(prompt, temperature = 0.7, stepName = "Gemini API") {
  if (!geminiClient || geminiQuotaExhausted) {
    throw new Error("Gemini client not configured or quota exhausted");
  }

  const maxRetries = 3;
  const initialDelayMs = 1500;
  const modelName = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      console.log(
        `[${stepName}] Calling ${modelName}${attempt > 1 ? ` (Retry ${attempt - 1}/${maxRetries})` : ""}...`
      );

      const model = geminiClient.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text() || "";

      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (err) {
      const isRateLimit =
        err.status === 429 ||
        err.statusCode === 429 ||
        err.message?.includes("429") ||
        err.message?.includes("RESOURCE_EXHAUSTED") ||
        err.message?.includes("rate limit") ||
        err.message?.includes("Rate limit") ||
        err.message?.includes("Too Many Requests");

      const isTransient =
        isRateLimit ||
        err.status === 503 ||
        err.statusCode === 503 ||
        err.status === 500 ||
        err.statusCode === 500 ||
        err.status === 502 ||
        err.statusCode === 502 ||
        err.status === 504 ||
        err.statusCode === 504 ||
        err.message?.includes("503") ||
        err.message?.includes("high demand") ||
        err.message?.includes("overloaded") ||
        err.message?.includes("Service Unavailable");

      const isQuotaHardError =
        err.message?.includes("quota") ||
        err.message?.includes("Quota exceeded") ||
        err.message?.includes("API_KEY_INVALID") ||
        err.status === 400 ||
        err.status === 403;

      console.error(`[${stepName} Error]: Status ${err.status || err.statusCode || "N/A"} - ${err.message}`);

      if (isQuotaHardError && !isRateLimit) {
        geminiQuotaExhausted = true;
        throw err;
      }

      if (isTransient && attempt <= maxRetries) {
        const backoffDelay = initialDelayMs * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 500);
        console.warn(`[${stepName} Transient/Rate Limit]: Retrying in ${backoffDelay}ms (Attempt ${attempt}/${maxRetries})...`);
        await sleep(backoffDelay);
        continue;
      }

      if (isRateLimit) {
        geminiQuotaExhausted = true;
      }

      throw err;
    }
  }
}

/**
 * Multi-step, self-reflective generation pipeline:
 * Step 1: Misconception Identification (AI identifies 2-3 misconceptions, reasons, and selects one).
 * Step 2: Draft Generation (Prompt incorporates the chosen misconception).
 * Step 3: Self-Critique (AI critiques the draft against checklist, approving or revising).
 * Step 4: Finalize (Normalizes output and passes candidate object).
 * 
 * @param {string} topic 
 * @param {string} difficulty 
 * @param {string[]} [previousQuestions=[]] 
 * @param {string[]} [usedClusters=[]] 
 * @param {string} [targetSubtopic=""] 
 * @returns {Promise<Object>}
 */
export async function generateQuestionPipeline(
  topic,
  difficulty = "medium",
  previousQuestions = [],
  usedClusters = [],
  targetSubtopic = ""
) {
  console.log(`\n--- [Pipeline Start] Topic: "${topic}" | Diff: ${difficulty} | SubTopic: "${targetSubtopic || 'Auto'}" ---`);

  // STEP 1 — MISCONCEPTION IDENTIFICATION
  const misconceptionPrompt = buildMisconceptionPrompt(topic, difficulty, targetSubtopic);
  const step1Result = await executeGeminiPrompt(misconceptionPrompt, 0.7, "Pipeline Step 1: Misconceptions");

  if (
    !step1Result ||
    (!step1Result.chosenMisconception && (!Array.isArray(step1Result.misconceptions) || step1Result.misconceptions.length === 0))
  ) {
    throw new Error("Step 1 failed: Invalid misconception output schema from AI");
  }

  const chosenMisconception = step1Result.chosenMisconception || step1Result.misconceptions[0];
  console.log(
    `[Pipeline Step 1: Misconception Selection]\n` +
    `  • Candidate Misconceptions: ${JSON.stringify(step1Result.misconceptions || [])}\n` +
    `  • Chosen Misconception: "${chosenMisconception}"\n` +
    `  • Diagnostic Reasoning: "${step1Result.reasoning || 'Targeted diagnostic discriminator.'}"`
  );

  // STEP 2 — DRAFT GENERATION
  const draftPrompt = buildPrompt(
    topic,
    difficulty,
    previousQuestions,
    usedClusters,
    targetSubtopic,
    null,
    chosenMisconception
  );
  const draft = await executeGeminiPrompt(draftPrompt, 0.7, "Pipeline Step 2: Draft Generation");

  if (!draft || typeof draft !== "object" || !draft.question || !Array.isArray(draft.options)) {
    throw new Error("Step 2 failed: Invalid draft question structure from AI");
  }

  draft.subTopic = draft.subTopic || draft.conceptTag || targetSubtopic || topic;
  draft.conceptTag = draft.subTopic;
  draft.hasCode = Boolean(draft.hasCode);
  draft.codeSnippet = typeof draft.codeSnippet === "string" ? draft.codeSnippet : "";
  draft.topic = topic;
  draft.difficulty = difficulty;

  console.log(
    `[Pipeline Step 2: Draft Generated]\n` +
    `  • SubTopic: "${draft.subTopic}" | hasCode: ${draft.hasCode}\n` +
    `  • Question: "${draft.question}"\n` +
    `  • Correct Answer: "${draft.correctAnswer}"\n` +
    `  • Distractors: ${JSON.stringify(draft.options.filter((o) => o !== draft.correctAnswer))}`
  );

  // STEP 3 — SELF-CRITIQUE
  const critiquePrompt = buildCritiquePrompt(topic, difficulty, draft, chosenMisconception);
  const critique = await executeGeminiPrompt(critiquePrompt, 0.3, "Pipeline Step 3: Self-Critique");

  let finalizedQuestion = draft;
  let wasRevised = false;
  if (
    critique &&
    critique.approved === false &&
    critique.revisedQuestion &&
    typeof critique.revisedQuestion === "object" &&
    critique.revisedQuestion.question
  ) {
    console.log(
      `[Pipeline Step 3: Self-Critique Result] Draft REVISED by AI critique.\n` +
      `  • Critique Notes: "${critique.critiqueNotes || 'Identified and corrected draft flaws.'}"\n` +
      `  • Original Question: "${draft.question}"\n` +
      `  • Revised Question: "${critique.revisedQuestion.question}"`
    );
    finalizedQuestion = critique.revisedQuestion;
    wasRevised = true;
  } else {
    console.log(`[Pipeline Step 3: Self-Critique Result] Draft APPROVED by AI critique (approved: true).`);
  }

  // STEP 4 — FINALIZE
  if (Array.isArray(finalizedQuestion.options)) {
    finalizedQuestion.options = shuffleOptions(finalizedQuestion.options);
  }
  finalizedQuestion.hasCode = Boolean(finalizedQuestion.hasCode);
  finalizedQuestion.codeSnippet = typeof finalizedQuestion.codeSnippet === "string" ? finalizedQuestion.codeSnippet : "";
  finalizedQuestion.subTopic = finalizedQuestion.subTopic || finalizedQuestion.conceptTag || targetSubtopic || topic;
  finalizedQuestion.conceptTag = finalizedQuestion.subTopic;
  finalizedQuestion.topic = topic;
  finalizedQuestion.difficulty = difficulty;
  finalizedQuestion.isFallback = false;
  finalizedQuestion.chosenMisconception = chosenMisconception;
  finalizedQuestion.critiqueApproved = !wasRevised;
  finalizedQuestion.critiqueNotes = critique?.critiqueNotes || null;

  console.log(`--- [Pipeline Complete] Finished candidate generation ---\n`);
  return finalizedQuestion;
}

/**
 * Calls Google Gemini API in single-shot mode with exponential backoff on 429/rate-limit errors.
 */
async function callGemini(topic, difficulty, previousQuestions = [], usedClusters = [], targetSubtopic = "") {
  const prompt = buildPrompt(topic, difficulty, previousQuestions, usedClusters, targetSubtopic);
  const parsed = await executeGeminiPrompt(prompt, 0.8, "Gemini Single-Shot API");

  if (parsed) {
    if (Array.isArray(parsed.options)) {
      parsed.options = shuffleOptions(parsed.options);
    }
    parsed.hasCode = Boolean(parsed.hasCode);
    parsed.codeSnippet = typeof parsed.codeSnippet === "string" ? parsed.codeSnippet : "";
    parsed.subTopic = parsed.subTopic || parsed.conceptTag || targetSubtopic || topic;
    parsed.conceptTag = parsed.subTopic;
    parsed.isFallback = false;
  }

  return parsed;
}

/**
 * Attempts AI generation with automatic fallback to single-shot or domain-aware local engine.
 */
async function callAI(topic, difficulty, previousQuestions = [], usedClusters = [], targetSubtopic = "") {
  if (process.env.MOCK_AI === "true") {
    console.log(`[AI Generator] MOCK_AI is true. Using local domain question generator.`);
    const fallback = generateFallbackQuestion(topic, difficulty, previousQuestions, usedClusters, targetSubtopic);
    fallback.generationPath = "mock-fallback";
    return fallback;
  }

  // 1. Try Google Gemini with Multi-Step Pipeline if enabled
  if (geminiClient && !geminiQuotaExhausted) {
    if (USE_MULTISTEP_PIPELINE) {
      try {
        console.log(`[AI Generator] Path: MULTI-STEP PIPELINE selected for "${topic}" (${difficulty})`);
        const q = await generateQuestionPipeline(topic, difficulty, previousQuestions, usedClusters, targetSubtopic);
        if (q) {
          q.generationPath = "pipeline";
          return q;
        }
      } catch (pipelineErr) {
        console.warn(
          `[Pipeline Error]: Multi-step pipeline failed (${pipelineErr.message}). Falling back to single-shot Gemini call.`
        );
      }
    }

    // 2. Single-shot Gemini call (either primary if pipeline disabled, or fallback if pipeline failed)
    try {
      console.log(`[AI Generator] Path: SINGLE-SHOT Gemini call for "${topic}" (${difficulty})`);
      const q = await callGemini(topic, difficulty, previousQuestions, usedClusters, targetSubtopic);
      if (q) {
        q.isFallback = false;
        q.generationPath = USE_MULTISTEP_PIPELINE ? "single-shot-fallback" : "single-shot";
        return q;
      }
    } catch (geminiErr) {
      console.warn(`[Gemini Notice]: Single-shot API call failed (${geminiErr.message}). Falling back to Domain-Aware Engine.`);
    }
  }

  // 3. Fallback to Local Domain-Aware Engine
  console.warn(
    `[Fallback Warning]: AI generation unavailable. Using Domain-Aware Fallback Engine for "${topic}" (${targetSubtopic || difficulty
    }) [isFallback: true]`
  );
  const fallback = generateFallbackQuestion(topic, difficulty, previousQuestions, usedClusters, targetSubtopic);
  fallback.generationPath = "local-fallback";
  return fallback;
}

/**
 * Generates a validated question with anti-duplication verification, curriculum subtopic tagging,
 * code snippet parsing, and option shuffling.
 * 
 * @param {string} topic 
 * @param {string} [difficulty="easy"] 
 * @param {string[]} [previousQuestions=[]] 
 * @param {string[]} [usedClusters=[]] 
 * @param {string} [targetSubtopic=""] 
 * @param {number} [attempt=1] 
 * @returns {Promise<Object>}
 */
export async function generateQuestion(
  topic,
  difficulty = "easy",
  previousQuestions = [],
  usedClusters = [],
  targetSubtopic = "",
  attempt = 1
) {
  const validDifficulties = ["easy", "medium", "hard"];
  const selectedDifficulty = validDifficulties.includes(difficulty?.toLowerCase())
    ? difficulty.toLowerCase()
    : "easy";

  const question = await callAI(topic, selectedDifficulty, previousQuestions, usedClusters, targetSubtopic);

  if (question && Array.isArray(question.options)) {
    question.options = shuffleOptions(question.options);
  }

  // Ensure subTopic and conceptTag synchronization
  if (question) {
    question.subTopic = question.subTopic || question.conceptTag || targetSubtopic || "Core Concept";
    question.conceptTag = question.subTopic;
    question.hasCode = Boolean(question.hasCode);
    question.codeSnippet = typeof question.codeSnippet === "string" ? question.codeSnippet : "";
  }

  // Comprehensive validation including duplicate safety check and code/subTopic checks
  const result = validateQuestion(question, previousQuestions);

  if (result.valid) {
    console.log(
      `[Question Generated]: Path: ${question.generationPath || (question.isFallback ? "FALLBACK" : "REAL_AI")} | Source: ${
        question.isFallback ? "FALLBACK" : "REAL_AI"
      } | Topic: "${topic}" | Diff: ${question.difficulty} | SubTopic: "${question.subTopic}" | hasCode: ${question.hasCode}`
    );
    return question;
  }

  console.warn(`[Attempt ${attempt}] Question validation warning: ${result.reason}`);

  if (attempt >= 2) {
    console.warn(`[Attempt ${attempt}] Retries exhausted. Falling back to local domain question bank.`);
    const fallbackQ = generateFallbackQuestion(topic, selectedDifficulty, previousQuestions, usedClusters, targetSubtopic);
    fallbackQ.generationPath = "validation-exhausted-fallback";
    return fallbackQ;
  }

  return generateQuestion(topic, selectedDifficulty, previousQuestions, usedClusters, targetSubtopic, attempt + 1);
}
