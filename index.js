/**
 * index.js
 * ------------------------------------------------------
 * Quick standalone CLI demo script.
 * 
 * To run:
 *   npm run demo
 */

// (Tip: If you ever want to change the port number, you can set PORT=3001 in your .env file).

import { generateQuestion } from "./questionGenerator.js";

async function demo() {
  const topic = "Newton's Second Law of Motion";
  const difficulty = "medium";

  console.log(`Generating a ${difficulty} question on "${topic}"...\n`);

  try {
    const question = await generateQuestion(topic, difficulty);

    console.log("QUESTION:", question.question);
    question.options.forEach((opt, i) => {
      console.log(`  ${String.fromCharCode(65 + i)}. ${opt}`);
    });
    console.log("\nCORRECT ANSWER:", question.correctAnswer);
    console.log("EXPLANATION:", question.explanation);
  } catch (err) {
    console.error("Error generating question:", err.message);
  }
}

demo();

