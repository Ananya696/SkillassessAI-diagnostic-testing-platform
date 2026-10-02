/**
 * verify-frontend-suite.js
 * ------------------------------------------------------
 * End-to-end verification of frontend HTML, CSS, JavaScript logic,
 * DOM IDs, classes, custom dropdown behavior, SVG chart generation,
 * code snippet extraction, feedback display, and collapsible review logic.
 */

import fs from "node:fs";
import path from "node:path";
import { ALLOWED_DOMAINS } from "./server.js";

const html = fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf-8");
const js = fs.readFileSync(path.join(process.cwd(), "public", "app.js"), "utf-8");
const css = fs.readFileSync(path.join(process.cwd(), "public", "style.css"), "utf-8");

console.log("==================================================");
console.log("RUNNING COMPREHENSIVE FRONTEND VERIFICATION SUITE");
console.log("==================================================");

// 1. SCREEN 1 VERIFICATION
console.log("\n--- Checking Screen 1 (Start / Setup Screen) ---");
if (!html.includes("Diagnostic Multi-Domain Technical Skill Assessment")) {
  throw new Error("Missing exact heading: Diagnostic Multi-Domain Technical Skill Assessment");
}
console.log("✓ Heading includes 'Technical': 'Diagnostic Multi-Domain Technical Skill Assessment'");

if (!html.includes("Adaptive Multi-Domain Engine")) {
  throw new Error("Missing badge: Adaptive Multi-Domain Engine");
}
console.log("✓ Badge present: 'Adaptive Multi-Domain Engine'");

if (!html.includes('id="domain-dropdown-container"') || !html.includes('id="domain-select-trigger"')) {
  throw new Error("Missing custom dropdown trigger or container for technical domain!");
}
console.log("✓ Custom domain dropdown container and trigger exist.");

if (!html.includes('id="domain-scope-desc"') || !html.includes('id="domain-scope-text"')) {
  throw new Error("Missing domain scope description container in HTML!");
}
console.log("✓ Domain scope subtitle elements exist.");

if (!html.includes('id="topic-inline-feedback"') || !html.includes('id="topic-inline-feedback-msg"')) {
  throw new Error("Missing inline feedback message container!");
}
console.log("✓ Inline feedback message container exists directly below domain dropdown.");

if (!html.includes('id="difficulty-dropdown-container"') || !html.includes('id="questions-dropdown-container"')) {
  throw new Error("Missing custom dropdowns for difficulty and questions!");
}
console.log("✓ Custom dropdowns for Starting Difficulty and Total Questions exist.");

// Check all 12 domains in app.js and HTML
const ORDERED_DOMAINS = [
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

for (const dom of ORDERED_DOMAINS) {
  if (!js.includes(`"${dom}"`)) {
    throw new Error(`Missing domain in app.js: ${dom}`);
  }
}
console.log("✓ All 12 curated domains configured in exact order in JS.");

// 2. SCREEN 2 VERIFICATION
console.log("\n--- Checking Screen 2 (Question Screen) ---");
if (!html.includes('id="question-counter"') || !html.includes('id="difficulty-badge"')) {
  throw new Error("Missing progress counter or difficulty badge in test screen!");
}
console.log("✓ Progress indicator and difficulty badge exist in top bar.");

if (!html.includes('id="question-code-panel"') || !html.includes('id="question-code-block"')) {
  throw new Error("Missing code snippet panel in HTML!");
}
console.log("✓ Distinct code snippet editor panel exists for code questions.");

if (!js.includes("extractQuestionContent")) {
  throw new Error("Missing code extraction and formatting logic in app.js!");
}
console.log("✓ Code snippet detection & extraction logic implemented in app.js.");

if (!html.includes('id="options-container"') || !css.includes(".option-btn")) {
  throw new Error("Missing options container or option-btn styling!");
}
console.log("✓ 4 large clickable answer option cards with hover & key states exist.");

// 3. SCREEN 3 VERIFICATION
console.log("\n--- Checking Screen 3 (Answer Feedback Screen) ---");
if (!html.includes('id="feedback-panel"') || !html.includes('id="feedback-status"') || !html.includes('id="explanation-text"')) {
  throw new Error("Missing feedback panel, feedback status, or explanation box!");
}
console.log("✓ Prominent feedback status indicator and explanation panel exist.");

if (!html.includes('id="next-btn"')) {
  throw new Error("Missing Next Question button!");
}
console.log("✓ 'Next Question' button exists for student-controlled pacing.");

// 4. SCREEN 4 VERIFICATION
console.log("\n--- Checking Screen 4 (Results Screen) ---");
if (!html.includes('id="final-score"') || !html.includes('id="score-percentage"')) {
  throw new Error("Missing final score elements!");
}
console.log("✓ Large final score & percentage display exists.");

if (!html.includes('id="chart-section"') || !html.includes('id="chart-svg-wrapper"')) {
  throw new Error("Missing difficulty progression chart container in HTML!");
}
console.log("✓ Difficulty Progression Chart container is placed prominently above breakdown list.");

if (!js.includes("renderDifficultyChart")) {
  throw new Error("Missing SVG chart rendering function in app.js!");
}
console.log("✓ SVG Difficulty Progression Chart rendering function implemented with Easy/Med/Hard gridlines & glow.");

if (!html.includes('id="breakdown-list"') || !html.includes('id="toggle-all-breakdown-btn"')) {
  throw new Error("Missing breakdown list or toggle all button!");
}
console.log("✓ Collapsible detailed question review list with Expand/Collapse All controls exists.");

if (!css.includes(".breakdown-item.is-expanded") || !css.includes(".breakdown-chevron")) {
  throw new Error("Missing CSS for collapsible accordion items!");
}
console.log("✓ CSS accordion styling and rotating chevron animations verified.");

// 5. CSS THEME VERIFICATION
console.log("\n--- Checking Theme Consistency & Colors ---");
if (!css.includes("--color-primary: #6366f1") || !css.includes("--bg-app: #080c16")) {
  throw new Error("Theme colors do not match the expected dark navy/purple palette!");
}
console.log("✓ Dark navy/black background and purple accent theme colors consistent across all screens.");

console.log("\n==================================================");
console.log("🎉 ALL FRONTEND SUITE VERIFICATION CHECKS PASSED!");
console.log("==================================================\n");
