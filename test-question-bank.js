/**
 * test-question-bank.js
 * ------------------------------------------------------
 * Direct unit test suite for questionBank.js:
 * 1. Validates presence of all 12 curated technical domains.
 * 2. Confirms complete absence of non-technical domains.
 * 3. Validates structure, options balancing, hints, and answers across all curated questions.
 * 4. Validates getSubtopicRoadmap() for all 12 domains.
 * 5. Validates procedural generation for arbitrary technical topics.
 */

import { TOPIC_BANKS, findTopicBank, getSubtopicRoadmap, generateProceduralQuestion, detectDomainCategory } from "./questionBank.js";

const EXPECTED_12_DOMAINS = [
  "c",
  "cpp",
  "dsa",
  "javascript",
  "python",
  "java",
  "sql",
  "oop",
  "os",
  "networks",
  "web_dev",
  "software_engineering"
];

const NON_TECHNICAL_KEYS = ["anatomy_biology", "math_calculus", "physics", "general_humanities", "life_sciences"];

function runTests() {
  console.log("\n========================================================");
  console.log("  QUESTION BANK TECHNICAL DOMAIN INTEGRITY TEST SUITE   ");
  console.log("========================================================");

  // 1. Verify exact technical domain keys
  const actualKeys = Object.keys(TOPIC_BANKS);
  console.log(`\n1. Verifying domain keys count (${actualKeys.length}/12)...`);
  if (actualKeys.length !== 12) {
    throw new Error(`Expected exactly 12 domains in TOPIC_BANKS, but found ${actualKeys.length}: ${actualKeys.join(", ")}`);
  }

  for (const expectedKey of EXPECTED_12_DOMAINS) {
    if (!TOPIC_BANKS[expectedKey]) {
      throw new Error(`Missing expected technical domain key: "${expectedKey}"`);
    }
    console.log(`  ✓ Found domain: [${expectedKey}] -> "${TOPIC_BANKS[expectedKey].name}"`);
  }

  // 2. Verify complete absence of non-technical banks
  console.log("\n2. Verifying absence of non-technical domains...");
  for (const nonTech of NON_TECHNICAL_KEYS) {
    if (TOPIC_BANKS[nonTech]) {
      throw new Error(`Non-technical domain found in TOPIC_BANKS: "${nonTech}"`);
    }
  }
  console.log("  ✓ Zero non-technical domains detected in question bank.");

  // 3. Validate every curated question across all domains
  console.log("\n3. Validating question structures across all 12 domains...");
  let totalQuestions = 0;

  for (const [key, bank] of Object.entries(TOPIC_BANKS)) {
    if (!Array.isArray(bank.subtopics) || bank.subtopics.length < 5) {
      throw new Error(`Domain [${key}] must have at least 5 subtopics, found ${bank.subtopics?.length}`);
    }

    for (const diff of ["easy", "medium", "hard"]) {
      const qList = bank[diff] || [];
      if (qList.length === 0) {
        throw new Error(`Domain [${key}] has zero questions for difficulty "${diff}"`);
      }

      for (let i = 0; i < qList.length; i++) {
        const q = qList[i];
        totalQuestions++;

        if (!q.question || typeof q.question !== "string" || q.question.trim().length < 15) {
          throw new Error(`Domain [${key}][${diff}][${i}] invalid question text: "${q.question}"`);
        }

        if (!Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Domain [${key}][${diff}][${i}] must have exactly 4 options`);
        }

        if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
          throw new Error(`Domain [${key}][${diff}][${i}] correctAnswer "${q.correctAnswer}" not in options`);
        }

        if (!q.explanation || typeof q.explanation !== "string" || q.explanation.length < 10) {
          throw new Error(`Domain [${key}][${diff}][${i}] missing valid explanation`);
        }

        if (!q.approachHint || typeof q.approachHint !== "string") {
          throw new Error(`Domain [${key}][${diff}][${i}] missing approachHint`);
        }

        if (typeof q.benchmarkSeconds !== "number" || q.benchmarkSeconds < 10) {
          throw new Error(`Domain [${key}][${diff}][${i}] invalid benchmarkSeconds`);
        }
      }
    }
  }
  console.log(`  ✓ Validated ${totalQuestions} curated questions across all 12 technical domains with 100% schema compliance.`);

  // 4. Test findTopicBank() resolution
  console.log("\n4. Testing domain resolution via findTopicBank()...");
  const testQueries = [
    { query: "C Programming Language", expected: "C Programming Language" },
    { query: "c++", expected: "C++ Programming Language" },
    { query: "Data Structures & Algorithms (DSA)", expected: "Data Structures & Algorithms (DSA)" },
    { query: "JavaScript Programming", expected: "JavaScript Programming" },
    { query: "Python", expected: "Python Programming" },
    { query: "Java Programming", expected: "Java Programming" },
    { query: "Database Management Systems (DBMS) & SQL", expected: "Database Management Systems (DBMS) & SQL" },
    { query: "Object-Oriented Programming (OOP) Concepts", expected: "Object-Oriented Programming (OOP) Concepts" },
    { query: "Operating Systems Concepts", expected: "Operating Systems Concepts" },
    { query: "Computer Networks Concepts", expected: "Computer Networks Concepts" },
    { query: "Web Development Fundamentals (HTML, CSS, JavaScript Basics)", expected: "Web Development Fundamentals" },
    { query: "Software Engineering Basics (SDLC, Version Control, etc.)", expected: "Software Engineering Basics" }
  ];

  for (const { query, expected } of testQueries) {
    const matched = findTopicBank(query);
    if (!matched) {
      throw new Error(`findTopicBank failed to resolve "${query}"`);
    }
    if (matched.name !== expected) {
      throw new Error(`findTopicBank resolved "${query}" to "${matched.name}", expected "${expected}"`);
    }
    console.log(`  ✓ "${query}" -> Matched "${matched.name}"`);
  }

  // 5. Test getSubtopicRoadmap()
  console.log("\n5. Testing getSubtopicRoadmap()...");
  for (const key of EXPECTED_12_DOMAINS) {
    const roadmap = getSubtopicRoadmap(TOPIC_BANKS[key].name, 15);
    if (!Array.isArray(roadmap) || roadmap.length !== 15) {
      throw new Error(`Roadmap for ${key} returned length ${roadmap?.length}, expected 15`);
    }
  }
  console.log("  ✓ Subtopic roadmaps successfully generated for all 12 domains.");

  // 6. Test procedural generation
  console.log("\n6. Testing technical procedural synthesis...");
  const proc = generateProceduralQuestion("Distributed Systems", "medium", 1, "Consensus Algorithms");
  if (!proc || !proc.question || proc.options.length !== 4 || !proc.options.includes(proc.correctAnswer)) {
    throw new Error("Procedural question synthesis failed basic validation");
  }
  console.log(`  ✓ Generated procedural question for custom topic "Distributed Systems":\n    "${proc.question}"`);

  console.log("\n========================================================");
  console.log("  🎉 ALL QUESTION BANK TESTS PASSED WITH 100% INTEGRITY! ");
  console.log("========================================================\n");
}

runTests();
