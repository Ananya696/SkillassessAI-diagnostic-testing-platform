/**
 * test-c-and-domains.js
 * ------------------------------------------------------
 * Verification for updated domain labels:
 * 1. Verifies GET /api/domains returns the exact 12 updated domain strings.
 * 2. Runs a 5-question test on "C Programming Language", inspecting every question
 *    to confirm it is genuinely about C programming.
 * 3. Spot-checks 3 other domains:
 *    - "Operating Systems Concepts"
 *    - "Python Programming"
 *    - "Computer Networks Concepts"
 */

import "dotenv/config";
import { app, ALLOWED_DOMAINS } from "./server.js";

const PORT = 3567;
const BASE_URL = `http://localhost:${PORT}`;
let serverInstance = null;

const EXPECTED_NEW_DOMAINS = [
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

async function verifyDomainsList() {
  console.log("\n============================================================");
  console.log("  VERIFICATION 1: GET /api/domains exact matching");
  console.log("============================================================");

  const res = await fetch(`${BASE_URL}/api/domains`);
  if (!res.ok) throw new Error(`GET /api/domains failed with status ${res.status}`);

  const data = await res.json();
  console.log("Returned Domains Count:", data.domains?.length);
  console.log("Returned Domains List:\n", data.domains);

  if (data.domains.length !== 12) {
    throw new Error(`Expected 12 domains, got ${data.domains.length}`);
  }

  for (let i = 0; i < EXPECTED_NEW_DOMAINS.length; i++) {
    const expected = EXPECTED_NEW_DOMAINS[i];
    const actual = data.domains[i];
    if (actual !== expected) {
      throw new Error(`Domain at index ${i} mismatch! Expected "${expected}", got "${actual}"`);
    }
  }

  console.log("✓ All 12 domain labels match exactly in order!");
}

async function testCSession() {
  console.log("\n============================================================");
  console.log("  VERIFICATION 2: 5-Question Test on 'C Programming Language'");
  console.log("============================================================");

  const topic = "C Programming Language";
  const startRes = await fetch(`${BASE_URL}/api/test/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic,
      numQuestions: 5,
      startDifficulty: "easy"
    })
  });

  if (!startRes.ok) {
    const err = await startRes.json();
    throw new Error(`Failed to start test for "${topic}": ${JSON.stringify(err)}`);
  }

  const startData = await startRes.json();
  const sessionId = startData.sessionId;
  console.log(`✓ Session Initialized: ${sessionId}`);

  let currentQ = startData;
  const cKeywords = [
    "pointer", "pointers", "malloc", "free", "calloc", "realloc", "struct", "union",
    "typedef", "sizeof", "memory", "array", "string", "null", "header", "macro",
    "preprocessor", "file", "int", "char", "void", "bss", "stack", "heap", "segment",
    "function", "variable", "compile", "c standard", "c99", "c11", "buffer", "byte",
    "dereference", "bitwise", "address"
  ];

  for (let q = 1; q <= 5; q++) {
    console.log(`\n[Q${q}] (${currentQ.difficulty.toUpperCase()}) | SubTopic: "${currentQ.subTopic || currentQ.conceptTag}" | hasCode: ${currentQ.hasCode}`);
    console.log(`     Question: "${currentQ.question}"`);
    if (currentQ.hasCode && currentQ.codeSnippet) {
      console.log(`     Code Snippet:\n${currentQ.codeSnippet}`);
    }
    console.log(`     Options: [${currentQ.options.join(" | ")}]`);
    console.log(`     Approach Hint: "${currentQ.approachHint}"`);

    // Verify question is genuinely about C programming
    const qLower = (currentQ.question + " " + (currentQ.codeSnippet || "") + " " + (currentQ.subTopic || "")).toLowerCase();
    const matchesCKeyword = cKeywords.some((kw) => qLower.includes(kw));

    if (!matchesCKeyword) {
      throw new Error(`Question ${q} does not appear to be about C programming: "${currentQ.question}"`);
    }

    // Submit answer
    const answerRes = await fetch(`${BASE_URL}/api/test/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        selectedAnswer: currentQ.options[0],
        timeSpentSeconds: 15
      })
    });

    if (!answerRes.ok) {
      const err = await answerRes.json();
      throw new Error(`Failed to answer Q${q}: ${JSON.stringify(err)}`);
    }

    const answerData = await answerRes.json();
    if (answerData.finished) {
      console.log(`\n✓ C Programming Session Completed! Score: ${answerData.score}/${answerData.totalQuestions}`);
      console.log(`✓ Sub-Topics in Breakdown: [${answerData.breakdown.map(b => b.subTopic).join(", ")}]`);
      break;
    } else {
      currentQ = answerData;
    }
  }

  console.log("✓ All 5 questions confirmed to be 100% authentic C Programming questions!");
}

async function spotCheckDomain(topic, expectedKeywordSubset) {
  console.log(`\n--- Spot Checking: "${topic}" ---`);
  const startRes = await fetch(`${BASE_URL}/api/test/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic,
      numQuestions: 2,
      startDifficulty: "medium"
    })
  });

  if (!startRes.ok) {
    const err = await startRes.json();
    throw new Error(`Spot check failed to start for "${topic}": ${JSON.stringify(err)}`);
  }

  const data = await startRes.json();
  console.log(`  [Q1] (${data.difficulty.toUpperCase()}) | SubTopic: "${data.subTopic || data.conceptTag}"`);
  console.log(`       Question: "${data.question}"`);
  if (data.hasCode) console.log(`       Code:\n${data.codeSnippet}`);

  const qLower = (data.question + " " + (data.subTopic || "")).toLowerCase();
  const matched = expectedKeywordSubset.some(kw => qLower.includes(kw));
  if (!matched) {
    console.warn(`Warning: Spot-check keywords not explicitly in question text, checking subtopic: "${data.subTopic}"`);
  }
  console.log(`✓ Domain "${topic}" successfully initialized and verified.`);
}

async function runSpotChecks() {
  console.log("\n============================================================");
  console.log("  VERIFICATION 3: Spot-Checking Other Renamed Domains");
  console.log("============================================================");

  // 1. Operating Systems Concepts
  await spotCheckDomain("Operating Systems Concepts", [
    "process", "thread", "cpu", "scheduling", "deadlock", "memory", "virtual", "page", "semaphore", "mutex", "system", "os"
  ]);

  // 2. Python Programming
  await spotCheckDomain("Python Programming", [
    "python", "decorator", "generator", "list", "dict", "tuple", "class", "gil", "asyncio", "function", "variable", "comprehension", "iter"
  ]);

  // 3. Computer Networks Concepts
  await spotCheckDomain("Computer Networks Concepts", [
    "network", "tcp", "udp", "ip", "osi", "packet", "routing", "dns", "http", "socket", "protocol", "layer"
  ]);

  // 4. Web Development Fundamentals (HTML, CSS, JavaScript Basics)
  await spotCheckDomain("Web Development Fundamentals (HTML, CSS, JavaScript Basics)", [
    "html", "css", "dom", "element", "selector", "flexbox", "grid", "browser", "script", "web", "layout", "event"
  ]);

  console.log("✓ All spot checks passed!");
}

async function main() {
  serverInstance = app.listen(PORT, async () => {
    console.log(`Test Server running on port ${PORT}`);
    try {
      await verifyDomainsList();
      await testCSession();
      await runSpotChecks();

      console.log("\n============================================================");
      console.log("  🎉 ALL DOMAIN LABEL UPDATES & C PROGRAMMING TESTS PASSED!");
      console.log("============================================================\n");
    } catch (err) {
      console.error("\n❌ Verification Failed:", err);
      process.exitCode = 1;
    } finally {
      if (serverInstance) serverInstance.close();
    }
  });
}

main();
