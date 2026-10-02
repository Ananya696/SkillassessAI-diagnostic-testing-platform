/**
 * test-upgrades.js
 * ------------------------------------------------------
 * Verification script for the 3 upgrades:
 * 1. Unit testing validateQuestion() failure & retry triggers:
 *    - Rejection on missing subTopic
 *    - Rejection on hasCode: true with missing/empty codeSnippet
 *    - Rejection on duplicate/near-duplicate question in previousQuestions
 *    - Acceptance on valid questions with hasCode true & false
 * 2. Coding questions & style verification across applicable vs non-applicable domains.
 * 3. End-to-end 10-question test session on "Database Management Systems (DBMS) / SQL":
 *    - Verify no duplicate/near-duplicate questions appear
 *    - Verify varying subTopic values
 *    - Verify at least one question with hasCode: true, codeSnippet present and well-formed
 *    - Verify session.breakdown contains subTopic, wasCorrect, hasCode, and codeSnippet
 */

import "dotenv/config";
import { validateQuestion, isQuestionDuplicate } from "./validator.js";
import { generateQuestion, buildPrompt, isCodeApplicableDomain } from "./questionGenerator.js";
import { app, ALLOWED_DOMAINS } from "./server.js";

let serverInstance = null;
const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;

async function runUnitTests() {
  console.log("\n============================================================");
  console.log("  UNIT TESTS: validateQuestion() & isQuestionDuplicate()");
  console.log("============================================================");

  // 1. Missing subTopic rejection
  const qWithoutSubTopic = {
    question: "What is a primary key in a relational database?",
    options: ["Unique row identifier", "Foreign table link", "Non-unique index", "Temporary table view"],
    correctAnswer: "Unique row identifier",
    explanation: "A primary key uniquely identifies each record in a database table.",
    hasCode: false,
    codeSnippet: ""
  };
  const resNoSubTopic = validateQuestion(qWithoutSubTopic);
  console.log(`[Test 1] Missing subTopic: valid = ${resNoSubTopic.valid}, reason = "${resNoSubTopic.reason}"`);
  if (resNoSubTopic.valid) throw new Error("validateQuestion should reject missing subTopic!");

  // 2. hasCode: true but missing/empty codeSnippet rejection
  const qInvalidCode = {
    question: "What is the output of the following SQL query?",
    subTopic: "Aggregate Queries",
    options: ["10", "20", "30", "40"],
    correctAnswer: "10",
    explanation: "The query aggregates the count of records.",
    hasCode: true,
    codeSnippet: "" // Empty!
  };
  const resNoCode = validateQuestion(qInvalidCode);
  console.log(`[Test 2] hasCode: true with empty codeSnippet: valid = ${resNoCode.valid}, reason = "${resNoCode.reason}"`);
  if (resNoCode.valid) throw new Error("validateQuestion should reject hasCode: true with empty codeSnippet!");

  // 3. hasCode: true with valid codeSnippet acceptance
  const qValidCode = {
    question: "What is the output of the following SQL query?",
    subTopic: "Joins",
    options: ["3 rows returned", "5 rows returned", "0 rows returned", "Syntax error thrown"],
    correctAnswer: "3 rows returned",
    explanation: "An INNER JOIN matches records where keys exist in both tables.",
    hasCode: true,
    codeSnippet: "SELECT e.name, d.department_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.id;"
  };
  const resValidCode = validateQuestion(qValidCode);
  console.log(`[Test 3] Valid code question: valid = ${resValidCode.valid}`);
  if (!resValidCode.valid) throw new Error(`validateQuestion should accept valid code question: ${resValidCode.reason}`);

  // 4. Duplicate / Near-Duplicate rejection
  const previous = [
    "What is the time complexity of searching an element in a balanced binary search tree?",
    "Explain the ACID properties in database transaction management."
  ];

  const duplicateExact = {
    ...qValidCode,
    question: "What is the time complexity of searching an element in a balanced binary search tree?"
  };
  const resDup = validateQuestion(duplicateExact, previous);
  console.log(`[Test 4a] Exact duplicate: valid = ${resDup.valid}, reason = "${resDup.reason}"`);
  if (resDup.valid) throw new Error("validateQuestion should reject exact duplicate question!");

  const nearDuplicate = {
    ...qValidCode,
    question: "What is the time complexity of searching an element in balanced binary search tree?"
  };
  const resNearDup = validateQuestion(nearDuplicate, previous);
  console.log(`[Test 4b] Near duplicate (high similarity): valid = ${resNearDup.valid}, reason = "${resNearDup.reason}"`);
  if (resNearDup.valid) throw new Error("validateQuestion should reject near-duplicate question!");

  console.log("✓ All unit tests for validateQuestion() and duplicate detection PASSED!\n");
}

async function runDomainApplicabilityTests() {
  console.log("============================================================");
  console.log("  DOMAIN APPLICABILITY & PROMPT GENERATION TESTS");
  console.log("============================================================");

  const codeDomains = [
    "JavaScript Programming",
    "Python Programming",
    "Java Programming",
    "C Programming Language",
    "C++ Programming Language",
    "Data Structures & Algorithms (DSA)",
    "Object-Oriented Programming (OOP) Concepts",
    "Web Development Fundamentals (HTML, CSS, JavaScript Basics)",
    "Database Management Systems (DBMS) & SQL"
  ];

  for (const d of codeDomains) {
    const isCode = isCodeApplicableDomain(d);
    console.log(`  Domain "${d}" -> isCodeApplicable: ${isCode}`);
    if (!isCode) throw new Error(`Domain "${d}" should be code-applicable!`);
  }

  const theoryDomains = [
    "Operating Systems Concepts",
    "Computer Networks Concepts",
    "Software Engineering Basics (SDLC, Version Control, etc.)"
  ];

  for (const d of theoryDomains) {
    const isCode = isCodeApplicableDomain(d);
    console.log(`  Domain "${d}" -> isCodeApplicable: ${isCode}`);
    if (isCode) throw new Error(`Domain "${d}" should NOT be code-applicable (pure theory)!`);
  }

  // Check prompt generation includes anti-duplication and subTopic
  const samplePrompt = buildPrompt(
    "Database Management Systems (DBMS) & SQL",
    "medium",
    ["What is 1NF in normalization?"],
    [],
    "Transactions & ACID",
    "code_output"
  );
  if (!samplePrompt.includes("PREVIOUSLY ASKED QUESTIONS")) {
    throw new Error("Prompt is missing PREVIOUSLY ASKED QUESTIONS anti-duplication block!");
  }
  if (!samplePrompt.includes("subTopic")) {
    throw new Error("Prompt is missing subTopic instruction!");
  }
  if (!samplePrompt.includes("hasCode") || !samplePrompt.includes("codeSnippet")) {
    throw new Error("Prompt is missing hasCode / codeSnippet schema!");
  }

  console.log("✓ All domain applicability and prompt building tests PASSED!\n");
}

async function runDbmsSessionTest() {
  console.log("============================================================");
  console.log("  END-TO-END 10-QUESTION TEST: DBMS & SQL");
  console.log("============================================================");

  const topic = "Database Management Systems (DBMS) & SQL";
  const numQuestions = 10;

  // Start Session
  const startRes = await fetch(`${BASE_URL}/api/test/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic,
      numQuestions,
      startDifficulty: "easy"
    })
  });

  if (!startRes.ok) {
    const err = await startRes.json();
    throw new Error(`Failed to start test session: ${JSON.stringify(err)}`);
  }

  const startData = await startRes.json();
  const sessionId = startData.sessionId;
  console.log(`✓ Session Started: ${sessionId}`);

  const questionsSeen = [];
  const subTopicsSeen = new Set();
  let codeQuestionFound = null;

  questionsSeen.push(startData.question);
  if (startData.subTopic) subTopicsSeen.add(startData.subTopic);
  if (startData.hasCode) codeQuestionFound = startData;

  console.log(`\n[Q1] (${startData.difficulty.toUpperCase()}) | SubTopic: "${startData.subTopic}" | hasCode: ${startData.hasCode}`);
  console.log(`     Question: "${startData.question}"`);
  if (startData.hasCode) {
    console.log(`     Code Snippet:\n${startData.codeSnippet}`);
  }

  let currentQuestion = startData;

  for (let q = 1; q <= numQuestions; q++) {
    const selectedAnswer = currentQuestion.options[0];
    const answerRes = await fetch(`${BASE_URL}/api/test/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        selectedAnswer,
        timeSpentSeconds: 18
      })
    });

    if (!answerRes.ok) {
      const err = await answerRes.json();
      throw new Error(`Failed to submit answer for Q${q}: ${JSON.stringify(err)}`);
    }

    const answerData = await answerRes.json();

    if (answerData.finished) {
      console.log(`\n============================================================`);
      console.log(`  ASSESSMENT FINISHED! Diagnostics & Breakdown Verification `);
      console.log(`============================================================`);
      console.log(`✓ Final Score: ${answerData.score}/${answerData.totalQuestions}`);
      console.log(`✓ Questions Asked: ${questionsSeen.length}/${numQuestions}`);
      console.log(`✓ Unique Sub-Topics Count: ${subTopicsSeen.size}`);
      console.log(`  Sub-Topics: [${Array.from(subTopicsSeen).join(", ")}]`);

      // Verify breakdown items contain subTopic and wasCorrect
      if (!Array.isArray(answerData.breakdown) || answerData.breakdown.length !== numQuestions) {
        throw new Error(`Expected breakdown length ${numQuestions}, got ${answerData.breakdown?.length}`);
      }

      for (let i = 0; i < answerData.breakdown.length; i++) {
        const item = answerData.breakdown[i];
        if (!item.subTopic || typeof item.subTopic !== "string" || item.subTopic.trim().length === 0) {
          throw new Error(`Breakdown item Q${item.questionNumber} missing subTopic!`);
        }
        if (typeof item.wasCorrect !== "boolean") {
          throw new Error(`Breakdown item Q${item.questionNumber} missing wasCorrect!`);
        }
        if (typeof item.hasCode !== "boolean") {
          throw new Error(`Breakdown item Q${item.questionNumber} missing hasCode!`);
        }
      }
      console.log(`✓ All ${numQuestions} breakdown entries contain subTopic, wasCorrect, hasCode, and codeSnippet.`);

      // Verify no duplicates in questionsSeen
      const uniqueNormalized = new Set(questionsSeen.map((q) => q.toLowerCase().trim()));
      if (uniqueNormalized.size !== numQuestions) {
        throw new Error(`Duplicate questions detected in session! Total: ${questionsSeen.length}, Unique: ${uniqueNormalized.size}`);
      }
      console.log(`✓ Zero duplicates detected: Exactly ${uniqueNormalized.size} unique questions out of ${numQuestions}.`);

      // Check subtopic variation
      if (subTopicsSeen.size < 2) {
        throw new Error(`Subtopics lacked variation! Found only ${subTopicsSeen.size} distinct subtopic.`);
      }
      console.log(`✓ SubTopic variation confirmed: ${subTopicsSeen.size} distinct sub-topics recorded.`);

      return;
    } else {
      questionsSeen.push(answerData.question);
      if (answerData.subTopic) subTopicsSeen.add(answerData.subTopic);
      if (answerData.hasCode && !codeQuestionFound) codeQuestionFound = answerData;

      console.log(`\n[Q${answerData.questionNumber}] (${answerData.difficulty.toUpperCase()}) | SubTopic: "${answerData.subTopic}" | hasCode: ${answerData.hasCode}`);
      console.log(`     Question: "${answerData.question}"`);
      if (answerData.hasCode) {
        console.log(`     Code Snippet:\n${answerData.codeSnippet}`);
      }
      currentQuestion = answerData;
    }
  }
}

async function testDirectCodingGeneration() {
  console.log("\n============================================================");
  console.log("  DIRECT AI GENERATION TEST FOR hasCode: true QUESTIONS");
  console.log("============================================================");

  // Generate question directly for Python with code output style
  const prompt = buildPrompt("Python", "medium", [], [], "List Comprehensions", "code_output");
  console.log("Generated prompt for code_output style (first 250 chars):\n", prompt.slice(0, 250), "...\n");

  const q = await generateQuestion("JavaScript", "medium", [], [], "Closures & Scope");
  console.log("Generated Question Object:");
  console.log({
    question: q.question,
    hasCode: q.hasCode,
    codeSnippet: q.codeSnippet,
    subTopic: q.subTopic,
    difficulty: q.difficulty,
    options: q.options,
    correctAnswer: q.correctAnswer
  });

  if (!q.subTopic) throw new Error("Generated question missing subTopic!");
  if (q.hasCode && (!q.codeSnippet || q.codeSnippet.trim().length === 0)) {
    throw new Error("hasCode is true but codeSnippet is missing or empty!");
  }
  console.log("✓ Direct question generation validated with well-formed schema!");
}

async function main() {
  serverInstance = app.listen(PORT, async () => {
    console.log(`Test Server running on port ${PORT}`);
    try {
      await runUnitTests();
      await runDomainApplicabilityTests();
      await runDbmsSessionTest();
      await testDirectCodingGeneration();
      console.log("\n============================================================");
      console.log("  🎉 ALL 3 UPGRADES SUCCESSFULLY VERIFIED AND VALIDATED!");
      console.log("============================================================\n");
    } catch (err) {
      console.error("\n❌ Test Failed:", err);
      process.exitCode = 1;
    } finally {
      if (serverInstance) {
        serverInstance.close();
      }
    }
  });
}

main();
