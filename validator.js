/**
 * validator.js
 * ------------------------------------------------------
 * Question validation & schema verification.
 * 
 * Verifies:
 * 1. Required fields (question, options, correctAnswer, explanation, subTopic).
 * 2. Coding questions schema (when hasCode is true, codeSnippet must be a non-empty string).
 * 3. Approach hint existence (falls back to default thought guidance if missing).
 * 4. Exactly 4 non-empty, unique options.
 * 5. Correct answer matching one of the 4 options.
 * 6. Meaningful question, subTopic, and explanation length.
 * 7. Anti-duplication safety check against session's previously asked questions.
 */

/**
 * Normalizes question text for similarity comparisons.
 * @param {string} str 
 * @returns {string}
 */
export function normalizeQuestionText(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Calculates word-level Jaccard similarity between two strings.
 * @param {string} textA 
 * @param {string} textB 
 * @returns {number}
 */
export function calculateSimilarity(textA, textB) {
  const normA = normalizeQuestionText(textA);
  const normB = normalizeQuestionText(textB);
  if (!normA || !normB) return 0;
  if (normA === normB) return 1.0;

  const wordsA = new Set(normA.split(" ").filter((w) => w.length > 2));
  const wordsB = new Set(normB.split(" ").filter((w) => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }

  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union;
}

/**
 * Checks if a question is a duplicate or near-duplicate of any previously asked question.
 * @param {string} newQuestionText 
 * @param {string[]} previousQuestions 
 * @returns {boolean}
 */
export function isQuestionDuplicate(newQuestionText, previousQuestions = []) {
  if (!newQuestionText || !Array.isArray(previousQuestions) || previousQuestions.length === 0) {
    return false;
  }

  const normNew = normalizeQuestionText(newQuestionText);
  if (!normNew) return false;

  for (const existing of previousQuestions) {
    if (!existing) continue;
    const normExisting = normalizeQuestionText(existing);
    if (normNew === normExisting) {
      return true;
    }
    const similarity = calculateSimilarity(newQuestionText, existing);
    if (similarity >= 0.75) {
      return true;
    }
  }

  return false;
}

/**
 * Validates a generated question object against structural, schema, and anti-duplication rules.
 * 
 * @param {Object} q - The question object to validate
 * @param {string[]} [previousQuestions=[]] - Previously asked question texts in this session
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateQuestion(q, previousQuestions = []) {
  // 1. Basic shape check - does it even have the fields we expect?
  if (!q || typeof q !== "object") {
    return { valid: false, reason: "Response was not a valid object." };
  }

  // Ensure subTopic/conceptTag synchronization if one is provided
  if (!q.subTopic && q.conceptTag && typeof q.conceptTag === "string") {
    q.subTopic = q.conceptTag;
  }
  if (!q.conceptTag && q.subTopic && typeof q.subTopic === "string") {
    q.conceptTag = q.subTopic;
  }

  const requiredFields = ["question", "options", "correctAnswer", "explanation", "subTopic"];
  for (const field of requiredFields) {
    if (!(field in q)) {
      return { valid: false, reason: `Missing required field: "${field}"` };
    }
  }

  // 2. Question text should be a non-empty string
  if (typeof q.question !== "string" || q.question.trim().length < 5) {
    return { valid: false, reason: "Question text is missing or too short." };
  }

  // 3. subTopic must be a non-empty string
  if (typeof q.subTopic !== "string" || q.subTopic.trim().length === 0) {
    return { valid: false, reason: "subTopic is missing or empty." };
  }

  // 4. Validate hasCode and codeSnippet fields
  if (q.hasCode === true) {
    if (typeof q.codeSnippet !== "string" || q.codeSnippet.trim().length === 0) {
      return { valid: false, reason: "codeSnippet must be a non-empty string when hasCode is true." };
    }
  } else {
    q.hasCode = false;
    if (typeof q.codeSnippet !== "string") {
      q.codeSnippet = "";
    }
  }

  // 5. Must have exactly 4 options
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    return { valid: false, reason: "There must be exactly 4 options." };
  }

  // 6. No two options should be identical
  const uniqueOptions = new Set(
    q.options.map((opt) => (typeof opt === "string" ? opt.trim().toLowerCase() : ""))
  );
  if (uniqueOptions.size !== 4) {
    return { valid: false, reason: "Two or more options are duplicates." };
  }

  // 7. Every option must be a non-empty string
  if (q.options.some((opt) => typeof opt !== "string" || opt.trim().length === 0)) {
    return { valid: false, reason: "One or more options is empty or invalid." };
  }

  // 8. The correct answer MUST be one of the 4 options (exact match)
  if (!q.options.includes(q.correctAnswer)) {
    return { valid: false, reason: "correctAnswer does not match any of the options." };
  }

  // 9. Explanation should exist and be meaningful
  if (typeof q.explanation !== "string" || q.explanation.trim().length < 8) {
    return { valid: false, reason: "Explanation is missing or too short." };
  }

  // 10. Ensure approachHint is set
  if (!q.approachHint || typeof q.approachHint !== "string") {
    q.approachHint = `Consider the core foundational concepts of ${q.subTopic || "this topic"} and eliminate options that violate basic principles.`;
  }

  // 11. Anti-duplication safety net check against previous questions in current session
  if (Array.isArray(previousQuestions) && previousQuestions.length > 0) {
    if (isQuestionDuplicate(q.question, previousQuestions)) {
      return {
        valid: false,
        reason: `Question is identical or near-identical to a previously asked question in this session.`
      };
    }
  }

  // If we made it here, the question passed all structural and anti-duplication checks
  return { valid: true };
}
