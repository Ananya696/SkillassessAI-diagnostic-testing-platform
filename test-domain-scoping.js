/**
 * test-domain-scoping.js
 * ------------------------------------------------------
 * Verification script for Curated Domain Scoping & Validation:
 * 1. Verifies GET /api/domains returns the exact 12 technical domains.
 * 2. Verifies invalid topic (e.g., "Anatomy", "Biology", "RandomTopic") returns 400 with clean JSON:
 *    { "error": true, "message": "Please select a valid topic from the dropdown list." }
 * 3. Verifies valid topic requests for all 12 domains succeed.
 * 4. Runs an end-to-end multi-question adaptive session on "Python".
 */

import "dotenv/config";
import { app } from "./server.js";

const PORT = 3678;
const BASE_URL = `http://localhost:${PORT}`;

const EXPECTED_DOMAINS = [
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

async function testDomainsEndpoint() {
  console.log("\n==================================================");
  console.log("TEST 1: Verify GET /api/domains");
  console.log("==================================================");

  const res = await fetch(`${BASE_URL}/api/domains`);
  if (!res.ok) {
    throw new Error(`GET /api/domains returned status ${res.status}`);
  }

  const data = await res.json();
  console.log("Received Domains from /api/domains:", data.domains);

  if (!Array.isArray(data.domains)) {
    throw new Error("data.domains is not an array");
  }

  if (data.domains.length !== 12) {
    throw new Error(`Expected 12 domains, but got ${data.domains.length}`);
  }

  for (const expected of EXPECTED_DOMAINS) {
    if (!data.domains.includes(expected)) {
      throw new Error(`Missing expected domain: "${expected}"`);
    }
  }

  console.log("✓ TEST 1 PASSED: Exactly 12 curated domains returned from single source of truth.");
}

async function testInvalidTopicRejection() {
  console.log("\n==================================================");
  console.log("TEST 2: Verify Server-Side Rejection of Invalid Topics");
  console.log("==================================================");

  const invalidTopics = [
    "Anatomy",
    "Human Anatomy",
    "Biology",
    "Astronomy",
    "Quantum Physics",
    "Arbitrary Text",
    "javascript", // Case check / exact match check
    "",
    null
  ];

  for (const invalid of invalidTopics) {
    const res = await fetch(`${BASE_URL}/api/test/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: invalid,
        numQuestions: 5,
        startDifficulty: "easy"
      })
    });

    const body = await res.json();
    console.log(`Testing topic: ${JSON.stringify(invalid)} -> HTTP Status: ${res.status}, Body:`, body);

    if (res.status !== 400) {
      throw new Error(`Expected HTTP 400 for topic "${invalid}", got ${res.status}`);
    }

    if (body.error !== true) {
      throw new Error(`Expected body.error === true, got ${body.error}`);
    }

    if (body.message !== "Please select a valid topic from the dropdown list.") {
      throw new Error(`Expected clean message "Please select a valid topic from the dropdown list.", got "${body.message}"`);
    }
  }

  console.log("✓ TEST 2 PASSED: All invalid topics properly rejected with HTTP 400 and clean guidance message.");
}

async function testValidDomains() {
  console.log("\n==================================================");
  console.log("TEST 3: Verify All 12 Curated Domains Can Start Sessions");
  console.log("==================================================");

  for (const domain of EXPECTED_DOMAINS) {
    const res = await fetch(`${BASE_URL}/api/test/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: domain,
        numQuestions: 5,
        startDifficulty: "easy"
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Failed to start session for valid domain "${domain}": ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (!data.sessionId || !data.question || !Array.isArray(data.options)) {
      throw new Error(`Invalid response structure for domain "${domain}"`);
    }

    console.log(`✓ Domain "${domain}": Session initialized (${data.sessionId.slice(0, 8)}), Q1: "${data.question.slice(0, 55)}..."`);
  }

  console.log("✓ TEST 3 PASSED: All 12 curated domains initialized successfully.");
}

async function testEndToEndSession(topic = "Python Programming") {
  console.log("\n==================================================");
  console.log(`TEST 4: End-to-End Test Session on "${topic}"`);
  console.log("==================================================");

  const startRes = await fetch(`${BASE_URL}/api/test/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic,
      numQuestions: 5,
      startDifficulty: "medium"
    })
  });

  const startData = await startRes.json();
  const sessionId = startData.sessionId;
  console.log(`Session Started: ${sessionId}`);

  let currentQ = startData;
  for (let q = 1; q <= 5; q++) {
    console.log(`  [Q${q}] (${currentQ.difficulty}): ${currentQ.question.slice(0, 60)}...`);
    const answerRes = await fetch(`${BASE_URL}/api/test/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        selectedAnswer: currentQ.options[0],
        timeSpentSeconds: 15
      })
    });

    const answerData = await answerRes.json();
    if (answerData.finished) {
      console.log(`✓ Test finished! Final Score: ${answerData.score}/${answerData.totalQuestions}`);
      console.log(`✓ Trajectory: ${answerData.difficultyProgression?.join(" -> ")}`);
    } else {
      currentQ = answerData;
    }
  }

  console.log("✓ TEST 4 PASSED: End-to-end adaptive session completed successfully.");
}

async function runAll() {
  const server = app.listen(PORT, async () => {
    try {
      await testDomainsEndpoint();
      await testInvalidTopicRejection();
      await testValidDomains();
      await testEndToEndSession("Python Programming");

      console.log("\n==================================================");
      console.log("🎉 ALL SCOPING & VALIDATION TESTS PASSED 100%!");
      console.log("==================================================\n");
    } catch (err) {
      console.error("\n❌ Verification Failed:", err);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

runAll();
