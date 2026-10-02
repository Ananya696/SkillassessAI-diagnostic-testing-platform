/**
 * app.js
 * ------------------------------------------------------
 * Client-side JavaScript for the Cognitive Adaptive MCQ Testing Platform.
 * 
 * Features:
 * - Screen 1: Setup with custom themed dropdowns & technical domain scope descriptors.
 * - Screen 2: Real-time question HUD with automatic code snippet panel detection & rendering.
 * - Screen 3: Prominent correct/incorrect visual indicator, cognitive pacing diag, and explanation.
 * - Screen 4: Results dashboard featuring an interactive SVG Adaptive Difficulty Progression Chart
 *             and collapsible detailed question review cards with filters.
 */

// ============================================================================
// State Management
// ============================================================================

const state = {
  sessionId: null,
  topic: "",
  totalQuestions: 10,
  currentQuestionNumber: 1,
  currentDifficulty: "medium",
  currentConceptTag: "Core Concept",
  currentSubtopic: "",
  currentSubCluster: "general",
  currentBenchmarkSeconds: 25,
  currentApproachHint: "",
  subtopicRoadmap: [],
  tierStreak: 0,
  nextTierThreshold: 3,
  nextQuestionPayload: null,
  isAnswerSubmitted: false,
  isFinished: false,
  isHintUnlocked: false,
  isHintRevealed: false,
  finalSummary: null,
  difficultyHistory: [],
  currentQuestionStartTime: 0,
  timerIntervalId: null,
  elapsedSeconds: 0,
  activeFilter: "all",
  allBreakdownExpanded: false,
};

// Domain Scope Descriptions (One-line scope subtitles)
const DOMAIN_SCOPES = {
  "JavaScript Programming": "Covers closures, async/promises, DOM, ES6+, prototypes & runtime behavior",
  "Python Programming": "Covers data structures, decorators, OOP, generators, comprehension & memory model",
  "Java Programming": "Covers OOP, JVM architecture, multithreading, collections framework & exception handling",
  "C Programming Language": "Covers pointers, memory management (malloc/free), structs, bit manipulation & standard I/O",
  "C++ Programming Language": "Covers STL containers, templates, RAII, memory management, references & polymorphism",
  "Data Structures & Algorithms (DSA)": "Covers arrays, trees, graphs, sorting & complexity analysis",
  "Object-Oriented Programming (OOP) Concepts": "Covers encapsulation, inheritance, polymorphism, abstraction, design principles & patterns",
  "Operating Systems Concepts": "Covers process management, threads, CPU scheduling, synchronization, deadlocks & memory",
  "Computer Networks Concepts": "Covers OSI/TCP-IP models, routing protocols, TCP/UDP, DNS, HTTP/HTTPS & security",
  "Database Management Systems (DBMS) & SQL": "Covers relational modeling, normalization, SQL queries, indexing, transactions & ACID",
  "Web Development Fundamentals (HTML, CSS, JavaScript Basics)": "Covers HTML5 semantics, modern CSS/flexbox/grid, JavaScript APIs, responsive design & security",
  "Software Engineering Basics (SDLC, Version Control, etc.)": "Covers SDLC, agile methodologies, testing strategies, CI/CD, architecture & clean code"
};

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

// Local storage key for cross-session deduplication
const RECENT_QUESTIONS_KEY = "skillAssess_recentQuestions_v4";

function getRecentQuestions() {
  try {
    const raw = localStorage.getItem(RECENT_QUESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveRecentQuestions(newQuestions) {
  try {
    const existing = getRecentQuestions();
    const combined = Array.from(new Set([...newQuestions, ...existing])).slice(0, 80);
    localStorage.setItem(RECENT_QUESTIONS_KEY, JSON.stringify(combined));
  } catch (e) {
    console.warn("Could not access localStorage for question deduplication:", e);
  }
}

// ============================================================================
// DOM Elements
// ============================================================================

// Screens
const startScreen = document.getElementById("start-screen");
const testScreen = document.getElementById("test-screen");
const resultsScreen = document.getElementById("results-screen");

// Error Banner
const errorBanner = document.getElementById("error-banner");
const errorMessage = document.getElementById("error-message");
const errorCloseBtn = document.getElementById("error-close-btn");

// Start Screen Controls
const startForm = document.getElementById("start-form");
const topicSelect = document.getElementById("topic-select");
const domainDropdownContainer = document.getElementById("domain-dropdown-container");
const domainSelectTrigger = document.getElementById("domain-select-trigger");
const domainTriggerText = document.getElementById("domain-trigger-text");
const domainDropdownMenu = document.getElementById("domain-dropdown-menu");
const domainScopeDesc = document.getElementById("domain-scope-desc");
const domainScopeText = document.getElementById("domain-scope-text");
const topicInlineFeedback = document.getElementById("topic-inline-feedback");
const topicInlineFeedbackMsg = document.getElementById("topic-inline-feedback-msg");

const startDifficultySelect = document.getElementById("start-difficulty");
const difficultyDropdownContainer = document.getElementById("difficulty-dropdown-container");
const difficultySelectTrigger = document.getElementById("difficulty-select-trigger");
const difficultyTriggerText = document.getElementById("difficulty-trigger-text");
const difficultyDropdownMenu = document.getElementById("difficulty-dropdown-menu");

const numQuestionsSelect = document.getElementById("num-questions");
const questionsDropdownContainer = document.getElementById("questions-dropdown-container");
const questionsSelectTrigger = document.getElementById("questions-select-trigger");
const questionsTriggerText = document.getElementById("questions-trigger-text");
const questionsDropdownMenu = document.getElementById("questions-dropdown-menu");

const startBtn = document.getElementById("start-btn");
const startBtnText = startBtn.querySelector(".btn-text");
const startBtnLoader = startBtn.querySelector(".btn-loader");

// Test Screen HUD & Elements
const fallbackWarningBadge = document.getElementById("fallback-warning-badge");
const questionCounter = document.getElementById("question-counter");
const conceptBadge = document.getElementById("concept-badge");
const tierStreakBadge = document.getElementById("tier-streak-badge");
const difficultyBadge = document.getElementById("difficulty-badge");
const timerWidget = document.getElementById("timer-widget");
const timerDigits = document.getElementById("timer-digits");
const timerTarget = document.getElementById("timer-target");
const progressBarFill = document.getElementById("progress-bar-fill");
const subtopicTitle = document.getElementById("subtopic-title");

// Question & Code Panel
const questionText = document.getElementById("question-text");
const questionCodePanel = document.getElementById("question-code-panel");
const codePanelTitle = document.getElementById("code-panel-title");
const questionCodeBlock = document.getElementById("question-code-block");
const optionsContainer = document.getElementById("options-container");
const evaluatingLoader = document.getElementById("evaluating-loader");

// Progressive Hint Elements
const hintContainer = document.getElementById("hint-container");
const hintIcon = document.getElementById("hint-icon");
const hintStatusTitle = document.getElementById("hint-status-title");
const hintStatusSub = document.getElementById("hint-status-sub");
const hintToggleBtn = document.getElementById("hint-toggle-btn");
const hintBody = document.getElementById("hint-body");
const hintText = document.getElementById("hint-text");

// Feedback Panel Elements
const feedbackPanel = document.getElementById("feedback-panel");
const feedbackStatus = document.getElementById("feedback-status");
const feedbackIcon = document.getElementById("feedback-icon");
const feedbackTitle = document.getElementById("feedback-title");
const cognitivePill = document.getElementById("cognitive-pill");
const cognitivePillIcon = document.getElementById("cognitive-pill-icon");
const cognitivePillText = document.getElementById("cognitive-pill-text");
const explanationText = document.getElementById("explanation-text");
const nextBtn = document.getElementById("next-btn");
const nextBtnText = document.getElementById("next-btn-text");

// Results Screen Elements
const finalScore = document.getElementById("final-score");
const finalTotal = document.getElementById("final-total");
const scorePercentage = document.getElementById("score-percentage");
const scoreEmoji = document.getElementById("score-emoji");
const resultsTopicSubtitle = document.getElementById("results-topic-subtitle");
const chartSvgWrapper = document.getElementById("chart-svg-wrapper");
const difficultyPathContainer = document.getElementById("difficulty-path");
const benchmarkTableBody = document.getElementById("benchmark-table-body");
const countMastered = document.getElementById("count-mastered");
const countSolid = document.getElementById("count-solid");
const countHesitant = document.getElementById("count-hesitant");
const countImpulsive = document.getElementById("count-impulsive");
const countGap = document.getElementById("count-gap");
const conceptList = document.getElementById("concept-list");
const recommendationList = document.getElementById("recommendation-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const toggleAllBreakdownBtn = document.getElementById("toggle-all-breakdown-btn");
const breakdownList = document.getElementById("breakdown-list");
const restartBtn = document.getElementById("restart-btn");
const copyReportBtn = document.getElementById("copy-report-btn");

// ============================================================================
// Custom Dropdown Architecture
// ============================================================================

/**
 * Creates and initializes a custom dropdown linked to an underlying select.
 */
function setupCustomDropdown({
  container,
  trigger,
  triggerText,
  menu,
  selectElement,
  options,
  placeholder = "-- Select --",
  onSelect = null
}) {
  if (!container || !trigger || !menu || !selectElement) return;

  function renderOptions() {
    menu.innerHTML = "";
    options.forEach((opt) => {
      const optItem = document.createElement("div");
      optItem.className = "dropdown-option";
      optItem.setAttribute("role", "option");
      optItem.setAttribute("data-value", opt.value);
      optItem.textContent = opt.label;

      if (selectElement.value === opt.value) {
        optItem.classList.add("is-selected");
      }

      optItem.addEventListener("click", () => {
        selectValue(opt.value, opt.label);
        closeDropdown();
      });

      menu.appendChild(optItem);
    });
  }

  function selectValue(val, label) {
    selectElement.value = val;
    triggerText.textContent = label || placeholder;
    
    // Update selected class in menu
    menu.querySelectorAll(".dropdown-option").forEach((el) => {
      if (el.getAttribute("data-value") === val) {
        el.classList.add("is-selected");
      } else {
        el.classList.remove("is-selected");
      }
    });

    // Fire native change event
    selectElement.dispatchEvent(new Event("change", { bubbles: true }));

    if (typeof onSelect === "function") {
      onSelect(val, label);
    }
  }

  function openDropdown() {
    // Close other dropdowns first
    document.querySelectorAll(".custom-dropdown-container.is-open").forEach((c) => {
      if (c !== container) {
        c.classList.remove("is-open");
        const t = c.querySelector(".custom-dropdown-trigger");
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });

    container.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeDropdown() {
    container.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function toggleDropdown(e) {
    e.stopPropagation();
    if (container.classList.contains("is-open")) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  trigger.addEventListener("click", toggleDropdown);

  // Initial render
  renderOptions();

  // Set initial text if value is already selected
  const initialSelected = options.find((o) => o.value === selectElement.value);
  if (initialSelected) {
    triggerText.textContent = initialSelected.label;
  }

  return {
    updateOptions: (newOptions) => {
      options = newOptions;
      renderOptions();
    },
    setValue: selectValue,
    close: closeDropdown,
  };
}

// Global click listener to close open dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-dropdown-container")) {
    document.querySelectorAll(".custom-dropdown-container.is-open").forEach((c) => {
      c.classList.remove("is-open");
      const t = c.querySelector(".custom-dropdown-trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }
});

let domainCustomDropdown = null;

function updateDomainScope(domain) {
  if (!domain || !DOMAIN_SCOPES[domain]) {
    domainScopeDesc.classList.add("hidden");
    domainScopeText.textContent = "";
    return;
  }
  domainScopeText.textContent = DOMAIN_SCOPES[domain];
  domainScopeDesc.classList.remove("hidden");
}

function initAllCustomDropdowns() {
  // 1. Technical Domain Custom Dropdown
  const domainOptions = ORDERED_DOMAINS.map((dom) => ({ value: dom, label: dom }));
  domainCustomDropdown = setupCustomDropdown({
    container: domainDropdownContainer,
    trigger: domainSelectTrigger,
    triggerText: domainTriggerText,
    menu: domainDropdownMenu,
    selectElement: topicSelect,
    options: domainOptions,
    placeholder: "-- Select a technical domain --",
    onSelect: (val) => {
      hideTopicInlineFeedback();
      updateDomainScope(val);
    }
  });

  // 2. Starting Difficulty Custom Dropdown
  const diffOptions = [
    { value: "easy", label: "🌱 Easy Warm-up (Foundational)" },
    { value: "medium", label: "⚡ Medium Challenge (Applied)" },
    { value: "hard", label: "🔥 Hard Challenge (Advanced / Deep)" }
  ];
  setupCustomDropdown({
    container: difficultyDropdownContainer,
    trigger: difficultySelectTrigger,
    triggerText: difficultyTriggerText,
    menu: difficultyDropdownMenu,
    selectElement: startDifficultySelect,
    options: diffOptions,
    placeholder: "⚡ Medium Challenge (Applied)"
  });

  // 3. Total Questions Custom Dropdown
  const questOptions = [
    { value: "10", label: "10 Questions (Standard Assessment)" },
    { value: "15", label: "15 Questions (Deep Diagnostic)" },
    { value: "20", label: "20 Questions (Comprehensive Exam)" },
    { value: "25", label: "25 Questions (Mastery Evaluation)" },
    { value: "30", label: "30 Questions (Full Benchmark Simulation)" }
  ];
  setupCustomDropdown({
    container: questionsDropdownContainer,
    trigger: questionsSelectTrigger,
    triggerText: questionsTriggerText,
    menu: questionsDropdownMenu,
    selectElement: numQuestionsSelect,
    options: questOptions,
    placeholder: "10 Questions (Standard Assessment)"
  });
}

/**
 * Dynamically populates and verifies the domain dropdown from backend single source of truth.
 */
async function initDomainDropdown() {
  if (!topicSelect) return;
  try {
    const response = await fetch("/api/domains");
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.domains) && data.domains.length > 0) {
        const domains = data.domains;
        const currentVal = topicSelect.value;
        topicSelect.innerHTML = `<option value="" disabled ${!currentVal ? "selected" : ""}>-- Select a technical domain --</option>`;
        domains.forEach((dom) => {
          const opt = document.createElement("option");
          opt.value = dom;
          opt.textContent = dom;
          if (currentVal === dom) opt.selected = true;
          topicSelect.appendChild(opt);
        });

        if (domainCustomDropdown) {
          domainCustomDropdown.updateOptions(domains.map((d) => ({ value: d, label: d })));
          if (currentVal) {
            domainCustomDropdown.setValue(currentVal, currentVal);
            updateDomainScope(currentVal);
          }
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch /api/domains dynamically; using fallback list:", err);
  }
}

// ============================================================================
// Stopwatch & Progressive Hint Trigger Logic
// ============================================================================

function resetHintUI() {
  state.isHintUnlocked = false;
  state.isHintRevealed = false;
  hintContainer.className = "hint-container hint-locked";
  hintStatusTitle.textContent = "Strategic Thinking Clue";
  hintStatusSub.textContent = `Unlocks after 30s past target benchmark (${state.currentBenchmarkSeconds + 30}s)`;
  hintToggleBtn.classList.add("hidden");
  hintToggleBtn.textContent = "View Clue";
  hintBody.classList.add("hidden");
  hintText.innerHTML = "";
}

function unlockHint() {
  if (state.isHintUnlocked) return;
  state.isHintUnlocked = true;
  hintContainer.className = "hint-container hint-unlocked hint-pulse";
  hintStatusTitle.textContent = "💡 Thinking Approach Clue Unlocked";
  hintStatusSub.textContent = "Exceeded target solve time (+30s). Here is a guiding thought model:";
  hintToggleBtn.classList.remove("hidden");
  hintToggleBtn.textContent = "Hide Clue";
  hintBody.classList.remove("hidden");
  hintText.innerHTML = formatRichContent(state.currentApproachHint || "Consider the core mechanisms and eliminate options that violate foundational principles.");
}

function toggleHint() {
  if (!state.isHintUnlocked) return;
  state.isHintRevealed = !state.isHintRevealed;
  if (state.isHintRevealed) {
    hintBody.classList.remove("hidden");
    hintToggleBtn.textContent = "Hide Clue";
  } else {
    hintBody.classList.add("hidden");
    hintToggleBtn.textContent = "View Clue";
  }
}

function startQuestionTimer() {
  stopQuestionTimer();
  state.elapsedSeconds = 0;
  state.currentQuestionStartTime = performance.now();
  timerDigits.textContent = "00:00";
  if (timerTarget) {
    timerTarget.textContent = `/ Target: ${state.currentBenchmarkSeconds}s`;
  }
  timerWidget.classList.remove("timer-warning");
  timerWidget.classList.remove("timer-critical");
  resetHintUI();

  const hintThresholdSeconds = state.currentBenchmarkSeconds + 30;

  state.timerIntervalId = setInterval(() => {
    state.elapsedSeconds = Math.round((performance.now() - state.currentQuestionStartTime) / 1000);
    const mins = String(Math.floor(state.elapsedSeconds / 60)).padStart(2, "0");
    const secs = String(state.elapsedSeconds % 60).padStart(2, "0");
    timerDigits.textContent = `${mins}:${secs}`;

    // Progressive visual pacing warnings
    if (state.elapsedSeconds > state.currentBenchmarkSeconds) {
      timerWidget.classList.add("timer-warning");
    }
    if (state.elapsedSeconds >= hintThresholdSeconds) {
      timerWidget.classList.add("timer-critical");
      unlockHint();
    }
  }, 500);
}

function stopQuestionTimer() {
  if (state.timerIntervalId) {
    clearInterval(state.timerIntervalId);
    state.timerIntervalId = null;
  }
  if (state.currentQuestionStartTime > 0) {
    state.elapsedSeconds = Math.max(1, Math.round((performance.now() - state.currentQuestionStartTime) / 1000));
  }
  return state.elapsedSeconds;
}

// ============================================================================
// Formatting, Code Extraction & Screen Helpers
// ============================================================================

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Detects and extracts code snippets from question text.
 * Returns { promptText, codeSnippet, language }
 */
function extractQuestionContent(rawText) {
  if (!rawText) return { promptText: "", codeSnippet: null, language: "" };

  // Check for Markdown code blocks ```lang\ncode```
  const mdCodeMatch = rawText.match(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/);
  if (mdCodeMatch) {
    const promptText = rawText.replace(mdCodeMatch[0], "").trim();
    return {
      promptText: promptText || "Analyze the following code snippet and select the correct option:",
      codeSnippet: mdCodeMatch[2].trim(),
      language: mdCodeMatch[1] || "code"
    };
  }

  // Check for inline multi-line code indicators or patterns like (e.g. function foo() { ... })
  const codeKeywords = [
    "#include", "def ", "class ", "function ", "SELECT ", "public class",
    "const ", "let ", "var ", "int main", "void ", "import ", "System.out.println",
    "console.log", "for (", "while ("
  ];

  const lines = rawText.split("\n");
  let promptLines = [];
  let codeLines = [];
  let foundCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isCodeLine = codeKeywords.some(kw => line.trim().startsWith(kw)) || 
                       (foundCode && (line.includes("{") || line.includes("}") || line.includes(";") || line.startsWith("  ") || line.startsWith("\t")));

    if (isCodeLine) {
      foundCode = true;
      codeLines.push(line);
    } else if (foundCode && line.trim() === "") {
      codeLines.push(line);
    } else if (!foundCode) {
      promptLines.push(line);
    } else {
      promptLines.push(line);
    }
  }

  if (codeLines.length >= 2) {
    return {
      promptText: promptLines.join("\n").trim() || "Analyze the following code snippet:",
      codeSnippet: codeLines.join("\n").trim(),
      language: "code"
    };
  }

  return {
    promptText: rawText,
    codeSnippet: null,
    language: ""
  };
}

function formatRichContent(text) {
  if (!text) return "";
  let clean = escapeHtml(text);

  // Markdown code blocks
  clean = clean.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="code-panel-pre"><code class="code-panel-code">${code.trim()}</code></pre>`;
  });

  // Inline code
  clean = clean.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  clean = clean.replace(/\n\n/g, "<br/><br/>");
  clean = clean.replace(/\n/g, "<br/>");
  return clean;
}

function showScreen(screenName) {
  startScreen.classList.add("hidden");
  testScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");

  if (screenName === "start") startScreen.classList.remove("hidden");
  if (screenName === "test") testScreen.classList.remove("hidden");
  if (screenName === "results") resultsScreen.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showError(msg) {
  errorMessage.textContent = msg || "An unexpected error occurred.";
  errorBanner.classList.remove("hidden");
  errorBanner.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideError() {
  errorBanner.classList.add("hidden");
  errorMessage.textContent = "";
}

function showTopicInlineFeedback(msg) {
  if (topicInlineFeedback && topicInlineFeedbackMsg) {
    topicInlineFeedbackMsg.textContent = msg || "Please select a valid topic from the dropdown list.";
    topicInlineFeedback.classList.remove("hidden");
    if (domainSelectTrigger) {
      domainSelectTrigger.focus();
    }
  }
}

function hideTopicInlineFeedback() {
  if (topicInlineFeedback) {
    topicInlineFeedback.classList.add("hidden");
  }
}

function updateDifficultyBadge(difficulty = "easy") {
  const diff = difficulty.toLowerCase();
  difficultyBadge.textContent = diff.charAt(0).toUpperCase() + diff.slice(1);
  difficultyBadge.className = "difficulty-badge";

  if (diff === "easy") difficultyBadge.classList.add("difficulty-easy");
  else if (diff === "hard") difficultyBadge.classList.add("difficulty-hard");
  else difficultyBadge.classList.add("difficulty-medium");
}

function updateProgress(questionNum, total, tierStreak = 0, nextThreshold = 3) {
  questionCounter.textContent = `Question ${questionNum} / ${total}`;
  const percentage = Math.round((questionNum / total) * 100);
  progressBarFill.style.width = `${percentage}%`;

  if (tierStreakBadge) {
    tierStreakBadge.textContent = `Tier Progress: ${tierStreak}/${nextThreshold}`;
  }
}

// ============================================================================
// Assessment Flow Handlers
// ============================================================================

async function handleStartTest(e) {
  e.preventDefault();
  hideError();
  hideTopicInlineFeedback();

  const topic = topicSelect ? topicSelect.value.trim() : "";
  const numQuestions = parseInt(numQuestionsSelect.value, 10) || 10;
  const startDifficulty = startDifficultySelect.value || "medium";

  if (!topic) {
    showTopicInlineFeedback("Please select a valid topic from the dropdown list.");
    return;
  }

  startBtn.disabled = true;
  startBtnText.textContent = "Initializing Adaptive Session...";
  startBtnLoader.classList.remove("hidden");

  const excludeQuestions = getRecentQuestions();

  try {
    const response = await fetch("/api/test/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        numQuestions,
        startDifficulty,
        excludeQuestions,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || (typeof data.error === "string" ? data.error : "") || "Please select a valid topic from the dropdown list.";
      if (response.status === 400 && (data.message || errorMsg.toLowerCase().includes("topic") || errorMsg.toLowerCase().includes("dropdown") || errorMsg.toLowerCase().includes("select"))) {
        showTopicInlineFeedback(errorMsg);
      } else {
        showError(errorMsg);
      }
      return;
    }

    state.sessionId = data.sessionId;
    state.topic = topic;
    state.totalQuestions = data.totalQuestions;
    state.currentQuestionNumber = data.questionNumber;
    state.currentDifficulty = data.difficulty;
    state.currentConceptTag = data.conceptTag || data.targetSubtopic || "Core Concept";
    state.currentSubtopic = data.targetSubtopic || topic;
    state.subtopicRoadmap = data.subtopicRoadmap || [];
    state.tierStreak = data.tierStreak || 0;
    state.nextTierThreshold = data.nextTierThreshold || 3;
    state.currentSubCluster = data.subCluster || "general";
    state.currentBenchmarkSeconds = data.benchmarkSeconds || 25;
    state.currentApproachHint = data.approachHint || "";
    state.isAnswerSubmitted = false;
    state.isFinished = false;
    state.finalSummary = null;
    state.difficultyHistory = [data.difficulty];

    saveRecentQuestions([data.question]);

    renderQuestion(
      data.question,
      data.options,
      data.difficulty,
      data.subTopic || data.conceptTag || data.targetSubtopic,
      data.benchmarkSeconds,
      data.approachHint,
      data.targetSubtopic || data.subTopic,
      data.tierStreak,
      Boolean(data.isFallback),
      Boolean(data.hasCode),
      data.codeSnippet || ""
    );
    showScreen("test");
  } catch (err) {
    console.error("Start Test Error:", err);
    showError(err.message || "Failed to start test session. Please check your connection.");
  } finally {
    startBtn.disabled = false;
    startBtnText.textContent = "Start Adaptive Assessment";
    startBtnLoader.classList.add("hidden");
  }
}

function renderQuestion(
  question,
  options,
  difficulty,
  conceptTag = "Core Concept",
  benchmarkSeconds = 25,
  approachHint = "",
  targetSubtopic = "",
  tierStreak = 0,
  isFallback = false,
  hasCode = false,
  codeSnippet = ""
) {
  state.isAnswerSubmitted = false;
  state.nextQuestionPayload = null;
  state.currentConceptTag = conceptTag;
  state.currentBenchmarkSeconds = benchmarkSeconds;
  state.currentApproachHint = approachHint;
  state.currentSubtopic = targetSubtopic || conceptTag;
  state.tierStreak = tierStreak;

  feedbackPanel.classList.add("hidden");
  evaluatingLoader.classList.add("hidden");

  if (fallbackWarningBadge) {
    if (isFallback) {
      fallbackWarningBadge.classList.remove("hidden");
    } else {
      fallbackWarningBadge.classList.add("hidden");
    }
  }

  updateDifficultyBadge(difficulty);
  updateProgress(state.currentQuestionNumber, state.totalQuestions, state.tierStreak, state.nextTierThreshold);

  if (conceptBadge) {
    conceptBadge.textContent = conceptTag;
  }
  if (subtopicTitle) {
    subtopicTitle.textContent = targetSubtopic || conceptTag;
  }

  // Handle explicit codeSnippet / hasCode or fallback to regex extraction
  let promptText = question;
  let code = "";

  if (hasCode && codeSnippet && typeof codeSnippet === "string" && codeSnippet.trim().length > 0) {
    promptText = question;
    code = codeSnippet.trim();
  } else {
    const parsed = extractQuestionContent(question);
    promptText = parsed.promptText;
    code = parsed.codeSnippet || "";
  }

  questionText.innerHTML = formatRichContent(promptText);

  if (code) {
    questionCodePanel.classList.remove("hidden");
    codePanelTitle.textContent = `${state.topic.toUpperCase()} CODE SNIPPET`;
    questionCodeBlock.textContent = code;
  } else {
    questionCodePanel.classList.add("hidden");
    questionCodeBlock.textContent = "";
  }

  // Render 4 Clickable Option Cards
  optionsContainer.innerHTML = "";
  const optionLetters = ["A", "B", "C", "D"];

  options.forEach((optText, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.setAttribute("data-option", optText);
    btn.setAttribute("data-index", String(index + 1));
    btn.setAttribute("data-letter", optionLetters[index] || "A");

    const letterSpan = document.createElement("span");
    letterSpan.className = "option-letter";
    letterSpan.textContent = optionLetters[index] || `${index + 1}`;

    const textSpan = document.createElement("span");
    textSpan.className = "option-text";
    textSpan.innerHTML = formatRichContent(optText);

    const keyBadge = document.createElement("span");
    keyBadge.className = "option-key-badge";
    keyBadge.textContent = `[${optionLetters[index]}]`;

    btn.appendChild(letterSpan);
    btn.appendChild(textSpan);
    btn.appendChild(keyBadge);

    btn.addEventListener("click", () => handleSelectAnswer(btn, optText));
    optionsContainer.appendChild(btn);
  });

  startQuestionTimer();
}

async function handleSelectAnswer(selectedBtn, selectedAnswer) {
  if (state.isAnswerSubmitted) return;
  state.isAnswerSubmitted = true;
  hideError();

  const timeSpent = stopQuestionTimer();

  const allOptionBtns = optionsContainer.querySelectorAll(".option-btn");
  allOptionBtns.forEach((btn) => (btn.disabled = true));

  evaluatingLoader.classList.remove("hidden");

  try {
    const response = await fetch("/api/test/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: state.sessionId,
        selectedAnswer: selectedAnswer,
        timeSpentSeconds: timeSpent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to process answer.");
    }

    evaluatingLoader.classList.add("hidden");

    // Option styling update (reveal correct and mark user answer)
    allOptionBtns.forEach((btn) => {
      const optVal = btn.getAttribute("data-option");
      if (optVal === data.correctAnswer) {
        btn.classList.add("reveal-correct");
      }
      if (btn === selectedBtn) {
        if (data.wasCorrect) {
          btn.classList.add("selected-correct");
        } else {
          btn.classList.add("selected-wrong");
        }
      }
    });

    // Answer Feedback indication
    feedbackStatus.className = `feedback-status ${data.wasCorrect ? "correct" : "incorrect"}`;
    feedbackIcon.textContent = data.wasCorrect ? "✓" : "✗";
    feedbackTitle.textContent = data.wasCorrect ? "Correct!" : "Incorrect";

    const diag = data.cognitiveDiagnosis || {};
    cognitivePill.className = `cognitive-pill ${diag.badgeClass || "diag-solid"}`;
    cognitivePillIcon.textContent = diag.icon || "✓";
    cognitivePillText.textContent = `${diag.label || "Evaluated"} (${timeSpent}s / Target: ${state.currentBenchmarkSeconds}s)`;

    explanationText.innerHTML = formatRichContent(data.explanation);

    if (data.finished) {
      state.isFinished = true;
      state.finalSummary = data;
      nextBtnText.innerHTML = "View Comprehensive Skill Assessment Report &rarr;";
    } else {
      state.nextQuestionPayload = data;
      state.difficultyHistory.push(data.difficulty);
      saveRecentQuestions([data.question]);
      nextBtnText.innerHTML = "Next Question &rarr;";
    }

    feedbackPanel.classList.remove("hidden");
    feedbackPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (err) {
    console.error("Answer Submission Error:", err);
    evaluatingLoader.classList.add("hidden");
    showError(err.message);
    state.isAnswerSubmitted = false;
    allOptionBtns.forEach((btn) => (btn.disabled = false));
    startQuestionTimer();
  }
}

function handleNextQuestion() {
  if (state.isFinished && state.finalSummary) {
    renderResults(state.finalSummary);
    showScreen("results");
    return;
  }

  if (state.nextQuestionPayload) {
    state.currentQuestionNumber = state.nextQuestionPayload.questionNumber;
    state.currentDifficulty = state.nextQuestionPayload.difficulty;

    renderQuestion(
      state.nextQuestionPayload.question,
      state.nextQuestionPayload.options,
      state.nextQuestionPayload.difficulty,
      state.nextQuestionPayload.subTopic || state.nextQuestionPayload.conceptTag,
      state.nextQuestionPayload.benchmarkSeconds,
      state.nextQuestionPayload.approachHint,
      state.nextQuestionPayload.targetSubtopic || state.nextQuestionPayload.subTopic,
      state.nextQuestionPayload.tierStreak,
      Boolean(state.nextQuestionPayload.isFallback),
      Boolean(state.nextQuestionPayload.hasCode),
      state.nextQuestionPayload.codeSnippet || ""
    );
  }
}

// ============================================================================
// SCREEN 4 — Results Screen & Difficulty Progression Chart Rendering
// ============================================================================

/**
 * Renders an interactive, responsive SVG Adaptive Difficulty Progression Chart
 */
function renderDifficultyChart(breakdown, difficultyProgression) {
  if (!chartSvgWrapper) return;

  const total = breakdown?.length || difficultyProgression?.length || 1;
  const history = breakdown && breakdown.length > 0
    ? breakdown.map(b => ({
        qNum: b.questionNumber,
        difficulty: (b.difficulty || "medium").toLowerCase(),
        wasCorrect: b.wasCorrect,
        concept: b.conceptTag || "Topic",
        time: b.timeSpentSeconds || 20
      }))
    : (difficultyProgression || ["medium"]).map((d, i) => ({
        qNum: i + 1,
        difficulty: (d || "medium").toLowerCase(),
        wasCorrect: true,
        concept: "Topic",
        time: 20
      }));

  const svgWidth = 680;
  const svgHeight = 220;
  const padding = { top: 35, right: 40, bottom: 40, left: 75 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Y-coords for 3 levels: Hard (top), Medium (middle), Easy (bottom)
  const yMap = {
    "hard": padding.top + 10,
    "medium": padding.top + graphHeight / 2,
    "easy": padding.top + graphHeight - 10
  };

  const points = history.map((item, index) => {
    const x = total === 1 
      ? padding.left + graphWidth / 2 
      : padding.left + (index / (total - 1)) * graphWidth;
    const y = yMap[item.difficulty] || yMap["medium"];
    return { ...item, x, y };
  });

  // Generate SVG path strings
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  // Generate area polygon
  let areaD = "";
  if (points.length > 0) {
    const bottomY = padding.top + graphHeight;
    areaD = `M ${points[0].x} ${bottomY} L ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      areaD += ` L ${points[i].x} ${points[i].y}`;
    }
    areaD += ` L ${points[points.length - 1].x} ${bottomY} Z`;
  }

  const svgHTML = `
    <svg class="progression-chart-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Difficulty Progression Chart">
      <defs>
        <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#818cf8" />
          <stop offset="50%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#6366f1" />
        </linearGradient>
        <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(129, 140, 248, 0.35)" />
          <stop offset="100%" stop-color="rgba(129, 140, 248, 0.0)" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Horizontal Grid Lines & Tier Labels -->
      <!-- Hard Tier -->
      <line x1="${padding.left}" y1="${yMap.hard}" x2="${svgWidth - padding.right}" y2="${yMap.hard}" stroke="#243048" stroke-dasharray="4,4" stroke-width="1.5" />
      <text x="${padding.left - 12}" y="${yMap.hard + 4}" fill="#f87171" font-size="11" font-weight="700" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif">🔥 Hard</text>

      <!-- Medium Tier -->
      <line x1="${padding.left}" y1="${yMap.medium}" x2="${svgWidth - padding.right}" y2="${yMap.medium}" stroke="#243048" stroke-dasharray="4,4" stroke-width="1.5" />
      <text x="${padding.left - 12}" y="${yMap.medium + 4}" fill="#fbbf24" font-size="11" font-weight="700" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif">⚡ Medium</text>

      <!-- Easy Tier -->
      <line x1="${padding.left}" y1="${yMap.easy}" x2="${svgWidth - padding.right}" y2="${yMap.easy}" stroke="#243048" stroke-dasharray="4,4" stroke-width="1.5" />
      <text x="${padding.left - 12}" y="${yMap.easy + 4}" fill="#34d399" font-size="11" font-weight="700" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif">🌱 Easy</text>

      <!-- Gradient Area Fill -->
      ${areaD ? `<path d="${areaD}" fill="url(#chartAreaGrad)" />` : ""}

      <!-- Progression Connecting Line -->
      ${pathD ? `<path d="${pathD}" fill="none" stroke="url(#chartLineGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />` : ""}

      <!-- X-Axis Question Labels & Node Circles -->
      ${points.map((pt) => {
        const nodeColor = pt.difficulty === "hard" ? "#f87171" : pt.difficulty === "medium" ? "#fbbf24" : "#34d399";
        const ringColor = pt.wasCorrect ? "#10b981" : "#ef4444";
        return `
          <g class="chart-node-group" tabindex="0">
            <!-- Vertical guide tick -->
            <line x1="${pt.x}" y1="${pt.y + 10}" x2="${pt.x}" y2="${svgHeight - padding.bottom + 8}" stroke="#1e293b" stroke-width="1" />
            
            <!-- X-axis Q label -->
            <text x="${pt.x}" y="${svgHeight - padding.bottom + 22}" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif">Q${pt.qNum}</text>
            
            <!-- Outer Halo -->
            <circle cx="${pt.x}" cy="${pt.y}" r="9" fill="${nodeColor}" opacity="0.25" />
            <!-- Node Border -->
            <circle cx="${pt.x}" cy="${pt.y}" r="6.5" fill="#080c16" stroke="${nodeColor}" stroke-width="2.5" />
            <!-- Center Indicator (Correct vs Wrong dot) -->
            <circle cx="${pt.x}" cy="${pt.y}" r="3" fill="${ringColor}" />

            <!-- Accessible Tooltip Title -->
            <title>Q${pt.qNum}: ${pt.difficulty.toUpperCase()} • ${pt.wasCorrect ? "CORRECT ✓" : "INCORRECT ✗"} (${pt.time}s) [${pt.concept}]</title>
          </g>
        `;
      }).join("")}
    </svg>
  `;

  chartSvgWrapper.innerHTML = svgHTML;
}

function renderResults(summary) {
  const score = summary.score;
  const total = summary.totalQuestions;
  const percentage = Math.round((score / total) * 100);

  finalScore.textContent = score;
  finalTotal.textContent = `/ ${total}`;
  scorePercentage.textContent = `${percentage}% Overall Accuracy`;
  resultsTopicSubtitle.textContent = `Diagnostic Technical Skill Assessment • Subject: ${state.topic}`;

  if (percentage >= 80) scoreEmoji.textContent = "🏆";
  else if (percentage >= 60) scoreEmoji.textContent = "👏";
  else if (percentage >= 40) scoreEmoji.textContent = "📚";
  else scoreEmoji.textContent = "💪";

  // 1. Render DIFFICULTY PROGRESSION CHART (Prominent adaptive engine visualization)
  renderDifficultyChart(summary.breakdown, summary.difficultyProgression || state.difficultyHistory);

  // 2. Render Adaptive Trajectory Path Pills
  if (difficultyPathContainer) {
    difficultyPathContainer.innerHTML = "";
    const progression = summary.difficultyProgression || state.difficultyHistory || [];
    
    progression.forEach((diff, idx) => {
      const stepPill = document.createElement("span");
      const d = (diff || "medium").toLowerCase();
      stepPill.className = `path-pill path-${d}`;
      stepPill.textContent = `Q${idx + 1}: ${d.charAt(0).toUpperCase() + d.slice(1)}`;
      difficultyPathContainer.appendChild(stepPill);

      if (idx < progression.length - 1) {
        const arrow = document.createElement("span");
        arrow.className = "path-arrow";
        arrow.textContent = "→";
        difficultyPathContainer.appendChild(arrow);
      }
    });
  }

  // 3. Render Collapsible Detailed Question Review
  renderReviewList(summary.breakdown, state.activeFilter);

  // 4. Populate Subtopic Curriculum Matrix
  if (conceptList && Array.isArray(summary.conceptMatrix)) {
    conceptList.innerHTML = "";
    summary.conceptMatrix.forEach((c) => {
      const row = document.createElement("div");
      row.className = "concept-row";

      const header = document.createElement("div");
      header.className = "concept-row-header";

      const title = document.createElement("span");
      title.className = "concept-name";
      title.textContent = c.concept;

      const meta = document.createElement("span");
      meta.className = "concept-meta";
      meta.innerHTML = `<strong>${c.accuracy}% Accuracy</strong> (${c.correct}/${c.total} • avg ${c.avgTime}s vs ${c.avgBenchmark}s target)`;

      header.appendChild(title);
      header.appendChild(meta);

      const track = document.createElement("div");
      track.className = "concept-bar-track";

      const fill = document.createElement("div");
      fill.className = `concept-bar-fill ${c.accuracy >= 75 ? "bar-high" : c.accuracy >= 40 ? "bar-med" : "bar-low"}`;
      fill.style.width = `${c.accuracy}%`;

      track.appendChild(fill);
      row.appendChild(header);
      row.appendChild(track);
      conceptList.appendChild(row);
    });
  }

  // 5. Populate Benchmark Target vs Actual Time Table
  if (benchmarkTableBody && Array.isArray(summary.breakdown)) {
    benchmarkTableBody.innerHTML = "";
    summary.breakdown.forEach((item) => {
      const tr = document.createElement("tr");
      const delta = item.timeDelta || (item.timeSpentSeconds - item.benchmarkSeconds);
      const isSlow = delta > 15;
      const isFast = delta < -10;

      const deltaClass = isSlow ? "delta-slow" : isFast ? "delta-fast" : "delta-target";
      const deltaSign = delta > 0 ? `+${delta}s` : `${delta}s`;

      const diag = item.cognitiveDiagnosis || {};

      tr.innerHTML = `
        <td>
          <div class="table-q-title">Q${item.questionNumber}: <strong>${item.conceptTag || "Core Concept"}</strong></div>
          <div class="table-q-sub">${item.difficulty?.toUpperCase()}</div>
        </td>
        <td><span class="table-time-target">${item.benchmarkSeconds}s</span></td>
        <td><strong class="table-time-actual">${item.timeSpentSeconds}s</strong></td>
        <td><span class="pace-delta-badge ${deltaClass}">${deltaSign}</span></td>
        <td><span class="diag-mini-badge ${diag.badgeClass || "diag-solid"}">${diag.icon || "✓"} ${diag.label || "Done"}</span></td>
      `;
      benchmarkTableBody.appendChild(tr);
    });
  }

  // 6. Populate Cognitive Matrix counts
  const cSum = summary.cognitiveSummary || {};
  if (countMastered) countMastered.textContent = cSum.mastered || 0;
  if (countSolid) countSolid.textContent = cSum.solid || 0;
  if (countHesitant) countHesitant.textContent = cSum.hesitant || 0;
  if (countImpulsive) countImpulsive.textContent = cSum.impulsive || 0;
  if (countGap) countGap.textContent = cSum.skillGaps || 0;

  // 7. Render Recommendations
  if (recommendationList && Array.isArray(summary.recommendations)) {
    recommendationList.innerHTML = "";
    summary.recommendations.forEach((rec) => {
      const li = document.createElement("li");
      li.className = "rec-item";
      li.innerHTML = `<span class="rec-bullet">👉</span> <span>${rec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</span>`;
      recommendationList.appendChild(li);
    });
  }
}

/**
 * Renders the collapsible question-by-question breakdown list.
 */
function renderReviewList(breakdown, filter = "all") {
  if (!breakdownList) return;
  breakdownList.innerHTML = "";

  const filtered = (breakdown || []).filter((item) => {
    if (filter === "mistakes") return !item.wasCorrect;
    if (filter === "hesitant") return (item.timeSpentSeconds > (item.benchmarkSeconds || 30) + 15) || !item.wasCorrect;
    return true;
  });

  if (filtered.length === 0) {
    breakdownList.innerHTML = `<div class="empty-review">No questions match this filter. Excellent performance!</div>`;
    return;
  }

  filtered.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "breakdown-item";
    if (state.allBreakdownExpanded || index === 0) {
      card.classList.add("is-expanded");
    }

    // Header (Clickable Trigger)
    const header = document.createElement("div");
    header.className = "breakdown-header";
    header.setAttribute("role", "button");
    header.setAttribute("tabindex", "0");
    header.setAttribute("aria-expanded", card.classList.contains("is-expanded") ? "true" : "false");

    const leftMeta = document.createElement("div");
    leftMeta.className = "breakdown-left-meta";

    const qNum = document.createElement("span");
    qNum.className = "breakdown-qnum";
    qNum.textContent = `Q${item.questionNumber} • ${item.difficulty?.toUpperCase() || "MEDIUM"}`;

    const concept = document.createElement("span");
    concept.className = "breakdown-concept-tag";
    concept.textContent = item.subTopic || item.conceptTag || "Core Concept";

    leftMeta.appendChild(qNum);
    leftMeta.appendChild(concept);

    const rightBadges = document.createElement("div");
    rightBadges.className = "breakdown-right-badges";

    const diag = item.cognitiveDiagnosis || {};
    const cogBadge = document.createElement("span");
    cogBadge.className = `diag-mini-badge ${diag.badgeClass || "diag-solid"}`;
    cogBadge.textContent = `${diag.icon || "✓"} ${item.timeSpentSeconds || 20}s`;

    const pill = document.createElement("span");
    pill.className = `breakdown-result-pill ${item.wasCorrect ? "correct" : "incorrect"}`;
    pill.textContent = item.wasCorrect ? "✓ Correct" : "✗ Incorrect";

    const chevron = document.createElement("span");
    chevron.className = "breakdown-chevron";
    chevron.textContent = "▼";

    rightBadges.appendChild(cogBadge);
    rightBadges.appendChild(pill);
    rightBadges.appendChild(chevron);

    header.appendChild(leftMeta);
    header.appendChild(rightBadges);

    // Collapsible Content
    const content = document.createElement("div");
    content.className = "breakdown-content";

    // Question Text & Code
    const qText = document.createElement("div");
    qText.className = "breakdown-question-text";
    qText.innerHTML = formatRichContent(item.question);
    content.appendChild(qText);

    if (item.hasCode && item.codeSnippet) {
      const codeBox = document.createElement("pre");
      codeBox.className = "code-panel-pre";
      codeBox.style.margin = "0.75rem 0";
      codeBox.innerHTML = `<code class="code-panel-code">${escapeHtml(item.codeSnippet)}</code>`;
      content.appendChild(codeBox);
    }

    // Answers Box
    const answersBox = document.createElement("div");
    answersBox.className = "breakdown-answers";

    const yourAnsRow = document.createElement("div");
    yourAnsRow.className = "breakdown-answer-row";
    yourAnsRow.innerHTML = `
      <span class="breakdown-label">Your Answer:</span>
      <span class="breakdown-val ${item.wasCorrect ? "user-correct" : "user-wrong"}">${formatRichContent(item.yourAnswer)}</span>
    `;
    answersBox.appendChild(yourAnsRow);

    if (!item.wasCorrect) {
      const correctAnsRow = document.createElement("div");
      correctAnsRow.className = "breakdown-answer-row";
      correctAnsRow.innerHTML = `
        <span class="breakdown-label">Correct Answer:</span>
        <span class="breakdown-val correct-ans">${formatRichContent(item.correctAnswer)}</span>
      `;
      answersBox.appendChild(correctAnsRow);
    }
    content.appendChild(answersBox);

    // Explanation Box
    const explanation = document.createElement("div");
    explanation.className = "breakdown-explanation";
    explanation.innerHTML = `<strong>Explanation:</strong> ${formatRichContent(item.explanation)}`;
    content.appendChild(explanation);

    // Toggle interaction
    function toggleCard() {
      const isExpanded = card.classList.toggle("is-expanded");
      header.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }

    header.addEventListener("click", toggleCard);
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard();
      }
    });

    card.appendChild(header);
    card.appendChild(content);
    breakdownList.appendChild(card);
  });
}

function handleToggleAllBreakdown() {
  state.allBreakdownExpanded = !state.allBreakdownExpanded;
  const items = breakdownList.querySelectorAll(".breakdown-item");
  items.forEach((item) => {
    if (state.allBreakdownExpanded) {
      item.classList.add("is-expanded");
      item.querySelector(".breakdown-header")?.setAttribute("aria-expanded", "true");
    } else {
      item.classList.remove("is-expanded");
      item.querySelector(".breakdown-header")?.setAttribute("aria-expanded", "false");
    }
  });

  if (toggleAllBreakdownBtn) {
    toggleAllBreakdownBtn.textContent = state.allBreakdownExpanded ? "Collapse All" : "Expand All";
  }
}

function handleCopyReport() {
  if (!state.finalSummary) return;
  const s = state.finalSummary;
  const percentage = Math.round((s.score / s.totalQuestions) * 100);

  let report = `# Diagnostic Technical Skill Assessment Report - ${state.topic}\n`;
  report += `- Score: ${s.score}/${s.totalQuestions} (${percentage}% Accuracy)\n`;
  report += `- Adaptive Trajectory: ${(s.difficultyProgression || []).join(" -> ")}\n\n`;

  report += `## Subtopic Curriculum Mastery:\n`;
  (s.conceptMatrix || []).forEach((c) => {
    report += `- ${c.concept}: ${c.accuracy}% (${c.correct}/${c.total})\n`;
  });

  report += `\n## Benchmark vs. Actual Solve Time Matrix:\n`;
  (s.breakdown || []).forEach((b) => {
    const delta = b.timeDelta > 0 ? `+${b.timeDelta}s` : `${b.timeDelta}s`;
    report += `- Q${b.questionNumber} [${b.conceptTag}]: Actual ${b.timeSpentSeconds}s vs Target ${b.benchmarkSeconds}s (${delta}) -> ${b.wasCorrect ? "CORRECT" : "INCORRECT"}\n`;
  });

  report += `\n## Actionable Remediation Plan:\n`;
  (s.recommendations || []).forEach((r) => {
    report += `- ${r}\n`;
  });

  navigator.clipboard.writeText(report).then(() => {
    const orig = copyReportBtn.textContent;
    copyReportBtn.textContent = "✓ Report Copied to Clipboard!";
    setTimeout(() => {
      copyReportBtn.textContent = orig;
    }, 2000);
  });
}

function handleRestart() {
  hideError();
  hideTopicInlineFeedback();
  stopQuestionTimer();
  if (topicSelect) topicSelect.value = "";
  if (domainTriggerText) domainTriggerText.textContent = "-- Select a technical domain --";
  if (domainScopeDesc) domainScopeDesc.classList.add("hidden");
  showScreen("start");
}

// ============================================================================
// Keyboard Navigation & Event Listeners
// ============================================================================

window.addEventListener("keydown", (e) => {
  if (testScreen.classList.contains("hidden")) return;

  // Next question hotkey (Enter or Space when feedback is open)
  if (!feedbackPanel.classList.contains("hidden") && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    handleNextQuestion();
    return;
  }

  // Option selection hotkeys: 1-4 or A-D
  if (!state.isAnswerSubmitted) {
    const keyMap = {
      "1": 0, "a": 0, "A": 0,
      "2": 1, "b": 1, "B": 1,
      "3": 2, "c": 2, "C": 2,
      "4": 3, "d": 3, "D": 3
    };

    if (keyMap.hasOwnProperty(e.key)) {
      const idx = keyMap[e.key];
      const btns = optionsContainer.querySelectorAll(".option-btn");
      if (btns[idx]) {
        btns[idx].click();
      }
    }
  }
});

startForm.addEventListener("submit", handleStartTest);
nextBtn.addEventListener("click", handleNextQuestion);
restartBtn.addEventListener("click", handleRestart);
errorCloseBtn.addEventListener("click", hideError);
if (hintToggleBtn) hintToggleBtn.addEventListener("click", toggleHint);
if (copyReportBtn) copyReportBtn.addEventListener("click", handleCopyReport);
if (toggleAllBreakdownBtn) toggleAllBreakdownBtn.addEventListener("click", handleToggleAllBreakdown);

if (topicSelect) {
  topicSelect.addEventListener("change", hideTopicInlineFeedback);
  topicSelect.addEventListener("input", hideTopicInlineFeedback);
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.activeFilter = btn.getAttribute("data-filter") || "all";
    if (state.finalSummary) {
      renderReviewList(state.finalSummary.breakdown, state.activeFilter);
    }
  });
});

// Initialize Custom Dropdowns and Dynamic Domains
initAllCustomDropdowns();
initDomainDropdown();
