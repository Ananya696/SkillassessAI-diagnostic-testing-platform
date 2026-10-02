/**
 * test-frontend-dom.js
 * ------------------------------------------------------
 * Validates frontend DOM structure, elements, styles, and consistency.
 */

import fs from "node:fs";
import path from "node:path";
import { ALLOWED_DOMAINS } from "./server.js";

const html = fs.readFileSync(path.join(process.cwd(), "public", "index.html"), "utf-8");
const js = fs.readFileSync(path.join(process.cwd(), "public", "app.js"), "utf-8");
const css = fs.readFileSync(path.join(process.cwd(), "public", "style.css"), "utf-8");

console.log("==================================================");
console.log("FRONTEND DOM & SOURCE CODE VERIFICATION");
console.log("==================================================");

// 1. Ensure NO free-text topic input remains
if (html.includes('id="topic-input"') || html.includes("placeholder=\"e.g. Human Anatomy")) {
  throw new Error("Found legacy free-text topic input in index.html!");
}
console.log("✓ Verified: No free-text topic input in index.html.");

// 2. Ensure topic-select exists
if (!html.includes('id="topic-select"')) {
  throw new Error("Missing select element with id 'topic-select' in index.html!");
}
console.log("✓ Verified: Select element with id 'topic-select' exists in index.html.");

// 3. Ensure all 12 domains are in #topic-select options
const topicSelectMatch = html.match(/<select id="topic-select"[^>]*>([\s\S]*?)<\/select>/);
if (!topicSelectMatch) {
  throw new Error("Could not find topic-select inner HTML!");
}
const optionMatches = [...topicSelectMatch[1].matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)];
const foundDomainsInHTML = optionMatches.map(m => m[1]).filter(val => val !== "");

console.log("Found domains in index.html #topic-select:", foundDomainsInHTML);

if (foundDomainsInHTML.length !== 12) {
  throw new Error(`Expected exactly 12 domain options in HTML, found ${foundDomainsInHTML.length}`);
}

for (const expected of ALLOWED_DOMAINS) {
  if (!foundDomainsInHTML.includes(expected)) {
    throw new Error(`Missing expected domain option in HTML: "${expected}"`);
  }
}
console.log("✓ Verified: Exactly the 12 curated domains are present in index.html dropdown options.");

// 4. Ensure topic-inline-feedback container exists
if (!html.includes('id="topic-inline-feedback"') || !html.includes('id="topic-inline-feedback-msg"')) {
  throw new Error("Missing inline feedback container elements in index.html!");
}
console.log("✓ Verified: topic-inline-feedback and topic-inline-feedback-msg exist in index.html.");

// 5. Ensure difficulty and num-questions select elements are untouched
if (!html.includes('id="start-difficulty"') || !html.includes('id="num-questions"')) {
  throw new Error("Missing starting difficulty or num-questions controls in index.html!");
}
console.log("✓ Verified: Starting difficulty and num-questions controls are preserved.");

// 6. Ensure CSS contains styling for topic-inline-feedback
if (!css.includes(".topic-inline-feedback") || !css.includes(".inline-feedback-icon") || !css.includes(".inline-feedback-msg")) {
  throw new Error("Missing CSS styles for topic-inline-feedback!");
}
console.log("✓ Verified: CSS styling for topic-inline-feedback is present.");

// 7. Ensure app.js wires topicSelect, initDomainDropdown, showTopicInlineFeedback, hideTopicInlineFeedback
if (!js.includes("topicSelect") || !js.includes("showTopicInlineFeedback") || !js.includes("initDomainDropdown") || !js.includes("/api/domains")) {
  throw new Error("Missing required JavaScript logic for dropdown and inline feedback in app.js!");
}
console.log("✓ Verified: app.js contains topicSelect, dynamic /api/domains initialization, and inline feedback handling.");

console.log("\n==================================================");
console.log("🎉 ALL FRONTEND DOM VERIFICATIONS PASSED 100%!");
console.log("==================================================\n");
