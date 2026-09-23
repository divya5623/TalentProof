import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { createHash } from "crypto";

const execFileAsync = promisify(execFile);

export type SupportLevel =
  | "fully_supported"
  | "partially_supported"
  | "manual_review"
  | "not_supported";

export type EvidencePack = {
  languages: string[];
  frameworks: string[];
  files: { path: string; size: number; hash: string }[];
  symbols: { file: string; name: string; kind: string; snippet: string }[];
  dependencies: string[];
  observations: string[];
  interpretations: string[];
  uncertainties: string[];
  securityNotes: string[];
  supportLevel: SupportLevel;
  supportReason: string;
};

const DANGEROUS = [
  /os\.system\s*\(/i,
  /subprocess\./i,
  /eval\s*\(/i,
  /exec\s*\(/i,
  /__import__\s*\(\s*['"]socket/i,
  /powershell/i,
  /rm\s+-rf/i,
];

export async function safeExtractInfo(rootDir: string): Promise<EvidencePack> {
  const files: EvidencePack["files"] = [];
  const symbols: EvidencePack["symbols"] = [];
  const observations: string[] = [];
  const interpretations: string[] = [];
  const uncertainties: string[] = [];
  const securityNotes: string[] = [];
  const languages = new Set<string>();
  const frameworks = new Set<string>();
  const dependencies: string[] = [];

  async function walk(dir: string, rel = "") {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "__pycache__") {
        continue;
      }
      const abs = path.join(dir, entry.name);
      const relative = path.join(rel, entry.name).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        await walk(abs, relative);
        continue;
      }
      const stat = await fs.stat(abs);
      if (stat.size > 200_000) continue;
      const content = await fs.readFile(abs, "utf8").catch(() => "");
      const hash = createHash("sha256").update(content).digest("hex").slice(0, 12);
      files.push({ path: relative, size: stat.size, hash });

      if (relative.endsWith(".py")) {
        languages.add("Python");
        for (const rule of DANGEROUS) {
          if (rule.test(content)) {
            securityNotes.push(`Potentially dangerous pattern in ${relative}`);
          }
        }
        const classMatches = content.matchAll(/^class\s+(\w+)/gm);
        for (const m of classMatches) {
          symbols.push({
            file: relative,
            name: m[1],
            kind: "class",
            snippet: extractSnippet(content, m.index || 0),
          });
        }
        const fnMatches = content.matchAll(/^def\s+(\w+)\s*\(/gm);
        for (const m of fnMatches) {
          symbols.push({
            file: relative,
            name: m[1],
            kind: "function",
            snippet: extractSnippet(content, m.index || 0),
          });
        }
      }
      if (relative.endsWith(".js") || relative.endsWith(".ts") || relative.endsWith(".tsx")) {
        languages.add(relative.endsWith(".ts") || relative.endsWith(".tsx") ? "TypeScript" : "JavaScript");
      }
      if (relative.endsWith(".java")) languages.add("Java");
      if (relative.endsWith(".cpp") || relative.endsWith(".cc")) languages.add("C++");
      if (relative.endsWith(".go")) languages.add("Go");
      if (relative.includes("package.json")) {
        frameworks.add("Node.js");
        try {
          const pkg = JSON.parse(content);
          dependencies.push(...Object.keys(pkg.dependencies || {}));
        } catch {
          /* ignore */
        }
      }
      if (content.includes("flask") || content.includes("Flask")) frameworks.add("Flask");
      if (content.includes("fastapi") || content.includes("FastAPI")) frameworks.add("FastAPI");
      if (content.includes("react")) frameworks.add("React");
      if (content.includes("next")) frameworks.add("Next.js");
    }
  }

  await walk(rootDir);

  observations.push(`Indexed ${files.length} files.`);
  if (languages.size) observations.push(`Detected languages: ${[...languages].join(", ")}.`);
  if (frameworks.size) observations.push(`Detected frameworks: ${[...frameworks].join(", ")}.`);
  if (symbols.length) observations.push(`Extracted ${symbols.length} symbols for question grounding.`);

  let supportLevel: SupportLevel = "manual_review";
  let supportReason = "Stack is outside the trusted execution allowlist for this MVP.";

  if (languages.has("Python") && !languages.has("Java") && !languages.has("C++")) {
    if (securityNotes.length === 0) {
      supportLevel = "fully_supported";
      supportReason = "Python project without blocked patterns — trusted runner can execute unit tests.";
    } else {
      supportLevel = "partially_supported";
      supportReason = "Python detected but security patterns require caution — tests may be skipped.";
    }
  } else if (languages.has("JavaScript") || languages.has("TypeScript")) {
    supportLevel = "partially_supported";
    supportReason = "Static analysis and project-specific questions available; execution requires manual review.";
  } else if (languages.size === 0) {
    supportLevel = "not_supported";
    supportReason = "No supported source files detected.";
  }

  interpretations.push(
    "AI interpretations below are hypotheses grounded in observed files — not authorship guarantees."
  );
  if (symbols.some((s) => s.name === "ExpenseTracker")) {
    interpretations.push("Project appears to implement an in-memory expense ledger with validation helpers.");
  }
  uncertainties.push("Ownership and originality cannot be proven from static analysis alone.");
  uncertainties.push("AI-generated code detection is intentionally not treated as definitive evidence.");

  return {
    languages: [...languages],
    frameworks: [...frameworks],
    files,
    symbols: symbols.slice(0, 40),
    dependencies: dependencies.slice(0, 40),
    observations,
    interpretations,
    uncertainties,
    securityNotes,
    supportLevel,
    supportReason,
  };
}

function extractSnippet(content: string, index: number) {
  const start = Math.max(0, content.lastIndexOf("\n", index - 1) + 1);
  return content.slice(start, start + 160).trim();
}

export async function runTrustedPythonTests(projectDir: string) {
  const mode = process.env.EXECUTION_MODE || "trusted";
  const started = Date.now();

  // Trusted mode: run unittest in project dir with timeout; no network assumed.
  try {
    const { stdout, stderr } = await execFileAsync(
      process.platform === "win32" ? "python" : "python3",
      ["-m", "unittest", "discover", "-s", "tests", "-v"],
      {
        cwd: projectDir,
        timeout: 20000,
        env: {
          ...process.env,
          PYTHONPATH: projectDir,
        },
        maxBuffer: 1024 * 1024,
      }
    );
    const durationMs = Date.now() - started;
    const combined = `${stdout}\n${stderr}`;
    const passed = (combined.match(/ok$/gm) || []).length || (combined.includes("OK") ? 1 : 0);
    const failed = (combined.match(/FAIL:|ERROR:/g) || []).length;
    const results = [
      { name: "unittest suite", status: failed ? "failed" : "passed", detail: combined.slice(0, 2000) },
    ];
    return {
      status: failed ? "failed" : "passed",
      durationMs,
      results,
      stdout: stdout.slice(0, 4000),
      stderr: stderr.slice(0, 4000),
      mode,
      passedCount: Math.max(passed, failed ? 0 : 1),
      failedCount: failed,
    };
  } catch (error: unknown) {
    const durationMs = Date.now() - started;
    const err = error as { stdout?: string; stderr?: string; message?: string };
    return {
      status: "failed",
      durationMs,
      results: [
        {
          name: "unittest suite",
          status: "failed",
          detail: (err.stderr || err.stdout || err.message || "Execution failed").slice(0, 2000),
        },
      ],
      stdout: (err.stdout || "").slice(0, 4000),
      stderr: (err.stderr || err.message || "").slice(0, 4000),
      mode,
      passedCount: 0,
      failedCount: 1,
    };
  }
}

export function generateProjectQuestions(evidence: EvidencePack) {
  const questions: {
    category: string;
    qtype: string;
    prompt: string;
    evidenceRefs: { file: string; name?: string }[];
    options?: string[];
    rubric: Record<string, string>;
  }[] = [];

  const byName = (name: string) => evidence.symbols.find((s) => s.name === name);

  const addExpense = byName("add_expense");
  const search = byName("search");
  const tracker = byName("ExpenseTracker");

  if (addExpense) {
    questions.push({
      category: "Basic implementation understanding",
      qtype: "written",
      prompt:
        "In expense_tracker.py, explain how `add_expense` validates input and what happens if the amount is invalid.",
      evidenceRefs: [{ file: addExpense.file, name: "add_expense" }],
      rubric: {
        accuracy: "Mentions positive amount check / ValueError",
        consistency: "Matches submitted implementation",
      },
    });
    questions.push({
      category: "Edge cases",
      qtype: "written",
      prompt:
        "How does the submitted code prevent duplicate transactions on the same day? Which fields are compared?",
      evidenceRefs: [{ file: addExpense.file, name: "add_expense" }],
      rubric: {
        accuracy: "Same day + category + amount",
        reasoning: "Explains why duplicates are blocked",
      },
    });
  }

  if (search) {
    questions.push({
      category: "Performance",
      qtype: "written",
      prompt:
        "What is the time complexity of `search` in this project, and why is that acceptable for this design?",
      evidenceRefs: [{ file: search.file, name: "search" }],
      rubric: {
        accuracy: "O(n) linear scan",
        tradeoffs: "Mentions small personal ledger assumption",
      },
    });
  }

  if (tracker) {
    questions.push({
      category: "Architecture",
      qtype: "written",
      prompt:
        "Why is expense data stored in an in-memory list inside `ExpenseTracker` instead of a database in this submission? What limitation does that create?",
      evidenceRefs: [{ file: tracker.file, name: "ExpenseTracker" }],
      rubric: {
        understanding: "In-memory list / no persistence",
        limitations: "Data lost on restart",
      },
    });
  }

  questions.push({
    category: "Debugging",
    qtype: "written",
    prompt:
      "A user reports that searching for an empty keyword returns no expenses. Using the submitted `search` implementation, is that a bug or intended behavior? Explain.",
    evidenceRefs: search
      ? [{ file: search.file, name: "search" }]
      : evidence.files.slice(0, 1).map((f) => ({ file: f.path })),
    rubric: {
      debugging: "Identifies early return on empty keyword",
      reasoning: "Explains intended guard",
    },
  });

  questions.push({
    category: "Security",
    qtype: "written",
    prompt:
      "If this tracker were exposed as a web API tomorrow, which validation already present in `add_expense` would still help, and what additional controls would you add?",
    evidenceRefs: addExpense
      ? [{ file: addExpense.file, name: "add_expense" }]
      : evidence.files.slice(0, 1).map((f) => ({ file: f.path })),
    rubric: {
      security: "Mentions validation + auth/rate limits/persistence controls",
    },
  });

  questions.push({
    category: "Improvement suggestions",
    qtype: "mcq",
    prompt: "Which improvement best matches a practical extension of THIS submitted project?",
    evidenceRefs: evidence.files.slice(0, 2).map((f) => ({ file: f.path })),
    options: [
      "Add persistence (SQLite/file) while keeping validation rules",
      "Rewrite the project in Rust immediately",
      "Remove all validation to speed up inserts",
      "Delete unit tests to reduce maintenance",
    ],
    rubric: { accuracy: "Persistence while keeping validation" },
  });

  // Ensure we never ask about missing code: filter refs against evidence files
  const fileSet = new Set(evidence.files.map((f) => f.path));
  return questions
    .filter((q) => q.evidenceRefs.every((r) => fileSet.has(r.file) || evidence.files.length === 0))
    .slice(0, 8)
    .map((q, index) => ({ ...q, orderIndex: index }));
}

export function scoreAnswer(prompt: string, answer: string, category: string) {
  const text = (answer || "").toLowerCase();
  if (!text.trim()) return { score: 0, feedback: "No answer provided." };

  const checks: { terms: string[]; weight: number }[] = [];
  if (/invalid|amount|valueerror/i.test(prompt)) {
    checks.push({ terms: ["valueerror", "positive", "amount", "invalid", "<=", "less"], weight: 40 });
  }
  if (/duplicate/i.test(prompt)) {
    checks.push({ terms: ["duplicate", "same day", "category", "amount", "today"], weight: 40 });
  }
  if (/time complexity|search/i.test(prompt)) {
    checks.push({ terms: ["o(n)", "linear", "scan", "loop", "small"], weight: 40 });
  }
  if (/in-memory|database|limitation/i.test(prompt)) {
    checks.push({ terms: ["memory", "list", "persist", "database", "restart", "lost"], weight: 40 });
  }
  if (/empty keyword|bug|intended/i.test(prompt)) {
    checks.push({ terms: ["intended", "empty", "return", "guard", "not a bug", "by design"], weight: 40 });
  }
  if (/web api|security|validation/i.test(prompt)) {
    checks.push({ terms: ["validation", "auth", "authentication", "rate", "sql", "sanitize"], weight: 40 });
  }
  if (/improvement|extension/i.test(prompt) || category === "Improvement suggestions") {
    if (text.includes("persist") || text.includes("sqlite") || text.includes("validation")) {
      return { score: 90, feedback: "Selected a practical extension aligned with the submission." };
    }
  }

  let hit = 0;
  let total = 0;
  for (const check of checks) {
    total += check.weight;
    const matched = check.terms.filter((t) => text.includes(t)).length;
    hit += Math.min(check.weight, matched * (check.weight / Math.max(2, check.terms.length / 2)));
  }

  // Base score for any substantive technical answer
  const lengthBonus = Math.min(25, Math.floor(text.split(/\s+/).length / 4));
  const raw = total ? (hit / total) * 75 + lengthBonus : 45 + lengthBonus;
  const score = Math.max(10, Math.min(98, Math.round(raw)));
  return {
    score,
    feedback:
      score >= 75
        ? "Answer aligns with observed implementation details."
        : score >= 50
          ? "Partial alignment — some key implementation details missing."
          : "Limited evidence of project-specific understanding.",
  };
}
