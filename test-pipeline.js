import {
  generateQuestion,
  generateQuestionPipeline,
  USE_MULTISTEP_PIPELINE
} from "./questionGenerator.js";
import { validateQuestion } from "./validator.js";

async function runPipelineVerification() {
  console.log("================================================================================");
  console.log("  MULTI-STEP PIPELINE VERIFICATION SUITE (5 REAL QUESTIONS)");
  console.log(`  USE_MULTISTEP_PIPELINE: ${USE_MULTISTEP_PIPELINE}`);
  console.log("================================================================================\n");

  const testCases = [
    { topic: "JavaScript Programming", difficulty: "easy", subTopic: "Closures & Scope" },
    { topic: "Python Programming", difficulty: "medium", subTopic: "List Mutability & References" },
    { topic: "Data Structures & Algorithms (DSA)", difficulty: "hard", subTopic: "Binary Search Trees" },
    { topic: "Database Management Systems (DBMS) & SQL", difficulty: "medium", subTopic: "Transactions & ACID" },
    { topic: "Operating Systems Concepts", difficulty: "easy", subTopic: "Process States & Scheduling" },
  ];

  const results = [];
  const previousQuestions = [];

  for (let i = 0; i < testCases.length; i++) {
    const { topic, difficulty, subTopic } = testCases[i];
    console.log(`\n>>>>>>>>>> RUNNING TEST CASE ${i + 1}/${testCases.length}: ${topic} (${difficulty}) <<<<<<<<<<`);
    
    const startTime = Date.now();
    try {
      const q = await generateQuestion(topic, difficulty, previousQuestions, [], subTopic);
      const durationMs = Date.now() - startTime;
      
      const validation = validateQuestion(q, previousQuestions);
      previousQuestions.push(q.question);

      const summary = {
        index: i + 1,
        topic: q.topic,
        difficulty: q.difficulty,
        subTopic: q.subTopic,
        hasCode: q.hasCode,
        hasCodeSnippet: Boolean(q.codeSnippet && q.codeSnippet.length > 0),
        optionsCount: q.options?.length,
        correctAnswerInOptions: q.options?.includes(q.correctAnswer),
        critiqueResult: q.critiqueApproved === true ? "APPROVED" : (q.critiqueApproved === false ? "REVISED" : "N/A"),
        critiqueNotes: q.critiqueNotes || "N/A",
        generationPath: q.generationPath,
        valid: validation.valid,
        validationReason: validation.reason || "PASSED",
        chosenMisconception: q.chosenMisconception || "N/A",
        durationSeconds: (durationMs / 1000).toFixed(1)
      };

      results.push({ summary, question: q });

      console.log(`\n[RESULT ${i + 1} SUMMARY]:`);
      console.log(`  • Valid: ${validation.valid ? "YES" : "NO"}`);
      console.log(`  • Question: "${q.question}"`);
      console.log(`  • SubTopic: "${q.subTopic}"`);
      console.log(`  • hasCode: ${q.hasCode} | codeSnippet lines: ${q.codeSnippet ? q.codeSnippet.split('\n').length : 0}`);
      console.log(`  • Chosen Misconception: "${q.chosenMisconception || 'N/A'}"`);
      console.log(`  • Step 3 Critique: ${summary.critiqueResult} (Notes: ${summary.critiqueNotes})`);
      console.log(`  • Correct Answer: "${q.correctAnswer}"`);
      console.log(`  • Distractors: ${JSON.stringify(q.options.filter(opt => opt !== q.correctAnswer))}`);
      console.log(`  • Generation Path: ${q.generationPath}`);
      console.log(`  • Duration: ${summary.durationSeconds}s`);
    } catch (err) {
      console.error(`[TEST CASE ${i + 1} ERROR]:`, err);
      results.push({
        summary: {
          index: i + 1,
          topic,
          difficulty,
          valid: false,
          error: err.message
        }
      });
    }

    // Add a short delay between test cases to respect rate limits
    if (i < testCases.length - 1) {
      console.log("\n[Rate Limit Protection]: Waiting 2.5s before next question...");
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
  }

  console.log("\n================================================================================");
  console.log("  OVERALL VERIFICATION REPORT");
  console.log("================================================================================");
  console.table(results.map(r => r.summary));

  const allValid = results.every(r => r.summary.valid === true);
  console.log(`\nAll 5 Questions Structurally & Psychometrically Valid: ${allValid ? "YES (100% PASS)" : "NO"}`);

  // Confirm schema matches frontend expectation
  console.log("\n--- FRONTEND SCHEMA COMPATIBILITY VERIFICATION ---");
  const requiredKeys = ["question", "hasCode", "codeSnippet", "subTopic", "options", "correctAnswer", "explanation", "difficulty", "topic", "conceptTag", "approachHint", "benchmarkSeconds"];
  for (const r of results) {
    if (r.question) {
      const missing = requiredKeys.filter(k => !(k in r.question));
      console.log(`Q${r.summary.index} (${r.summary.topic}): ${missing.length === 0 ? "ALL REQUIRED KEYS PRESENT" : `MISSING: ${missing.join(", ")}`}`);
    }
  }
}

runPipelineVerification().catch(console.error);
