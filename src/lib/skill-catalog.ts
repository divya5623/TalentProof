/**
 * Talent Proof — skill catalog + exam question bank (JSON-shaped for LLM extension).
 * Each skill exam is offline-capable for the hackathon demo.
 */

export type SkillQuestion = {
  id: string;
  type: "mcq" | "written" | "code";
  prompt: string;
  options?: string[];
  /** Accepted answer keys / keywords for local scoring */
  answerKey: string[];
  rubric: string;
};

export type SkillDef = {
  slug: string;
  name: string;
  category: string;
  keywords: string[];
  passScore: number;
  questions: SkillQuestion[];
};

export const SKILL_CATALOG: SkillDef[] = [
  {
    slug: "python",
    name: "Python",
    category: "language",
    keywords: ["python", "django", "flask", "fastapi", "pandas", "numpy"],
    passScore: 70,
    questions: [
      {
        id: "py1",
        type: "mcq",
        prompt: "What does `len([1, 2, 3])` return?",
        options: ["2", "3", "1", "Error"],
        answerKey: ["3"],
        rubric: "Basic list length",
      },
      {
        id: "py2",
        type: "mcq",
        prompt: "Which keyword creates a function in Python?",
        options: ["function", "def", "fun", "method"],
        answerKey: ["def"],
        rubric: "Function definition",
      },
      {
        id: "py3",
        type: "written",
        prompt: "Explain the difference between a list and a tuple in Python (2–3 sentences).",
        answerKey: ["mutable", "immutable", "list", "tuple", "change"],
        rubric: "Lists mutable, tuples immutable",
      },
      {
        id: "py4",
        type: "code",
        prompt:
          "Write a Python function `is_even(n)` that returns True if n is even. Paste only the function.",
        answerKey: ["def", "is_even", "%", "2", "return"],
        rubric: "Uses modulo and return",
      },
      {
        id: "py5",
        type: "mcq",
        prompt: "What is the time complexity of accessing `my_dict[key]` on average?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        answerKey: ["O(1)"],
        rubric: "Hash map average access",
      },
    ],
  },
  {
    slug: "javascript",
    name: "JavaScript",
    category: "language",
    keywords: ["javascript", "js", "node.js", "nodejs", "express"],
    passScore: 70,
    questions: [
      {
        id: "js1",
        type: "mcq",
        prompt: "Which declares a block-scoped variable?",
        options: ["var", "let", "define", "set"],
        answerKey: ["let"],
        rubric: "let/const block scope",
      },
      {
        id: "js2",
        type: "mcq",
        prompt: "`===` checks:",
        options: ["Value only", "Value and type", "Type only", "Reference only"],
        answerKey: ["Value and type"],
        rubric: "Strict equality",
      },
      {
        id: "js3",
        type: "written",
        prompt: "What is a Promise in JavaScript? When would you use async/await?",
        answerKey: ["async", "await", "promise", "asynchronous", "then"],
        rubric: "Async understanding",
      },
      {
        id: "js4",
        type: "code",
        prompt: "Write a function `sum(a, b)` in JavaScript that returns a + b.",
        answerKey: ["function", "sum", "return", "=>", "+"],
        rubric: "Simple function",
      },
      {
        id: "js5",
        type: "mcq",
        prompt: "JSON.parse is used to:",
        options: ["Convert object to string", "Convert JSON string to object", "Fetch APIs", "Create arrays"],
        answerKey: ["Convert JSON string to object"],
        rubric: "JSON.parse",
      },
    ],
  },
  {
    slug: "typescript",
    name: "TypeScript",
    category: "language",
    keywords: ["typescript", "ts"],
    passScore: 70,
    questions: [
      {
        id: "ts1",
        type: "mcq",
        prompt: "TypeScript mainly adds:",
        options: ["CSS", "Static types", "Databases", "Hardware access"],
        answerKey: ["Static types"],
        rubric: "TS purpose",
      },
      {
        id: "ts2",
        type: "written",
        prompt: "Why use an `interface` or `type` in TypeScript?",
        answerKey: ["type", "interface", "shape", "compile", "safety", "error"],
        rubric: "Type safety",
      },
      {
        id: "ts3",
        type: "mcq",
        prompt: "`string | null` is an example of:",
        options: ["Tuple", "Union type", "Enum", "Class"],
        answerKey: ["Union type"],
        rubric: "Union",
      },
      {
        id: "ts4",
        type: "code",
        prompt: "Write a typed function `greet(name: string): string` that returns Hello + name.",
        answerKey: ["string", "greet", "return", "Hello"],
        rubric: "Typed function",
      },
      {
        id: "ts5",
        type: "mcq",
        prompt: "What does `tsc` do?",
        options: ["Runs Python", "Compiles TypeScript to JavaScript", "Installs npm", "Starts Docker"],
        answerKey: ["Compiles TypeScript to JavaScript"],
        rubric: "Compiler",
      },
    ],
  },
  {
    slug: "react",
    name: "React",
    category: "framework",
    keywords: ["react", "react.js", "reactjs", "next.js", "nextjs"],
    passScore: 70,
    questions: [
      {
        id: "re1",
        type: "mcq",
        prompt: "Which hook stores local component state?",
        options: ["useEffect", "useState", "useMemo", "useRef"],
        answerKey: ["useState"],
        rubric: "useState",
      },
      {
        id: "re2",
        type: "written",
        prompt: "When does useEffect run if you pass an empty dependency array `[]`?",
        answerKey: ["mount", "once", "initial", "render", "empty"],
        rubric: "Mount once",
      },
      {
        id: "re3",
        type: "mcq",
        prompt: "Props are:",
        options: ["Read-only inputs to a component", "Mutable global state", "CSS only", "Database rows"],
        answerKey: ["Read-only inputs to a component"],
        rubric: "Props",
      },
      {
        id: "re4",
        type: "code",
        prompt: "Write a tiny React function component that renders <h1>Hello</h1>.",
        answerKey: ["function", "return", "h1", "Hello", "=>"],
        rubric: "Basic component",
      },
      {
        id: "re5",
        type: "mcq",
        prompt: "Keys in lists help React:",
        options: ["Style CSS", "Identify items for efficient updates", "Call APIs", "Hash passwords"],
        answerKey: ["Identify items for efficient updates"],
        rubric: "Keys",
      },
    ],
  },
  {
    slug: "sql",
    name: "SQL / Databases",
    category: "data",
    keywords: ["sql", "mysql", "postgresql", "postgres", "mongodb", "database", "sqlite"],
    passScore: 70,
    questions: [
      {
        id: "sq1",
        type: "mcq",
        prompt: "Which statement reads rows from a table?",
        options: ["INSERT", "SELECT", "UPDATE", "DROP"],
        answerKey: ["SELECT"],
        rubric: "SELECT",
      },
      {
        id: "sq2",
        type: "written",
        prompt: "What is a primary key? Why does it matter?",
        answerKey: ["unique", "identify", "row", "primary", "null"],
        rubric: "Primary key",
      },
      {
        id: "sq3",
        type: "mcq",
        prompt: "JOIN is used to:",
        options: ["Combine rows from related tables", "Delete indexes", "Encrypt data", "Create CSS"],
        answerKey: ["Combine rows from related tables"],
        rubric: "JOIN",
      },
      {
        id: "sq4",
        type: "code",
        prompt: "Write SQL to select all columns from table `users` where age > 18.",
        answerKey: ["select", "from", "users", "where", "age", "18"],
        rubric: "Basic SELECT",
      },
      {
        id: "sq5",
        type: "mcq",
        prompt: "SQL injection is best prevented by:",
        options: ["String concat", "Parameterized queries", "Bigger fonts", "More JOINs"],
        answerKey: ["Parameterized queries"],
        rubric: "Security",
      },
    ],
  },
  {
    slug: "java",
    name: "Java",
    category: "language",
    keywords: ["java", "spring", "jvm"],
    passScore: 70,
    questions: [
      {
        id: "ja1",
        type: "mcq",
        prompt: "Java entry point method is usually:",
        options: ["start()", "main(String[] args)", "run()", "init()"],
        answerKey: ["main(String[] args)"],
        rubric: "main",
      },
      {
        id: "ja2",
        type: "written",
        prompt: "What is the difference between `==` and `.equals()` for Strings?",
        answerKey: ["reference", "content", "equals", "object", "=="],
        rubric: "Equals vs ==",
      },
      {
        id: "ja3",
        type: "mcq",
        prompt: "`private` means:",
        options: ["Accessible everywhere", "Accessible only inside the class", "Package only", "Subclass only"],
        answerKey: ["Accessible only inside the class"],
        rubric: "Access modifier",
      },
      {
        id: "ja4",
        type: "code",
        prompt: "Write a Java method `int add(int a, int b)` that returns a+b.",
        answerKey: ["int", "add", "return", "a", "b"],
        rubric: "Method",
      },
      {
        id: "ja5",
        type: "mcq",
        prompt: "Garbage collection in Java mainly:",
        options: ["Frees unused objects", "Compiles CSS", "Sends emails", "Draws UI"],
        answerKey: ["Frees unused objects"],
        rubric: "GC",
      },
    ],
  },
  {
    slug: "cpp",
    name: "C++",
    category: "language",
    keywords: ["c++", "cpp", "cplusplus"],
    passScore: 70,
    questions: [
      {
        id: "cp1",
        type: "mcq",
        prompt: "Which header is commonly used for `cout`?",
        options: ["<stdio.h>", "<iostream>", "<string.h>", "<math.h>"],
        answerKey: ["<iostream>"],
        rubric: "iostream",
      },
      {
        id: "cp2",
        type: "written",
        prompt: "What is a pointer? Give one reason to use one.",
        answerKey: ["address", "memory", "pointer", "reference", "*"],
        rubric: "Pointers",
      },
      {
        id: "cp3",
        type: "mcq",
        prompt: "`vector` in C++ is part of:",
        options: ["STL", "JVM", "DOM", "CSS"],
        answerKey: ["STL"],
        rubric: "STL",
      },
      {
        id: "cp4",
        type: "code",
        prompt: "Write a C++ function `int add(int a, int b)` returning a+b.",
        answerKey: ["int", "add", "return"],
        rubric: "Function",
      },
      {
        id: "cp5",
        type: "mcq",
        prompt: "RAII helps with:",
        options: ["Resource lifetime / cleanup", "CSS animation", "SQL joins", "HTTP cookies"],
        answerKey: ["Resource lifetime / cleanup"],
        rubric: "RAII",
      },
    ],
  },
  {
    slug: "git",
    name: "Git & GitHub",
    category: "tooling",
    keywords: ["git", "github", "gitlab", "version control"],
    passScore: 70,
    questions: [
      {
        id: "gi1",
        type: "mcq",
        prompt: "`git clone` does what?",
        options: ["Deletes repo", "Copies a remote repo locally", "Creates a branch only", "Runs tests"],
        answerKey: ["Copies a remote repo locally"],
        rubric: "clone",
      },
      {
        id: "gi2",
        type: "written",
        prompt: "What is the difference between `git pull` and `git fetch`?",
        answerKey: ["fetch", "merge", "pull", "remote", "download"],
        rubric: "fetch vs pull",
      },
      {
        id: "gi3",
        type: "mcq",
        prompt: "A pull request is mainly for:",
        options: ["Reviewing and merging code changes", "Deleting branches only", "Hosting websites", "Encrypting files"],
        answerKey: ["Reviewing and merging code changes"],
        rubric: "PR",
      },
      {
        id: "gi4",
        type: "code",
        prompt: "Write the commands to stage all files and commit with message \"init\".",
        answerKey: ["git", "add", "commit", "init"],
        rubric: "add + commit",
      },
      {
        id: "gi5",
        type: "mcq",
        prompt: "`main` / `master` usually represents:",
        options: ["A CSS file", "The primary branch", "A database table", "An API key"],
        answerKey: ["The primary branch"],
        rubric: "main branch",
      },
    ],
  },
];

export function getSkillBySlug(slug: string) {
  return SKILL_CATALOG.find((s) => s.slug === slug);
}

export function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const skill of SKILL_CATALOG) {
    for (const kw of skill.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        found.add(skill.slug);
        break;
      }
    }
  }
  return [...found];
}
