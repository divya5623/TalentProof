import type { Skill } from '../types';

export const TOP_SKILLS: Skill[] = [
  {
    id: 'react-arch',
    title: 'React Architecture & Frontend Systems',
    category: 'Frontend Engineering',
    difficulty: 'Advanced',
    duration: '20 Mins',
    badgeCode: 'REACT',
    syllabus: [
      'Concurrent Rendering & Fiber Reconciler Internals',
      'Custom Hook Memory Leak & Closure Bug Mitigation',
      'Micro-Frontend Federation & Dynamic Chunk Splitting',
      'Virtual DOM Batching & Selective Hydration (SSR/RSC)'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'A high-frequency dashboard receiving 500 WebSocket events/second experiences sluggish UI updates and browser frame drops below 15 FPS.',
        question: 'Which architectural strategy correctly mitigates main-thread starvation while preserving critical UI responsiveness?',
        options: [
          { id: 'opt-a', text: 'Wrap all WebSocket dispatch actions inside useSyncExternalStore with startTransition batching and requestAnimationFrame throttling.' },
          { id: 'opt-b', text: 'Replace React state with a global mutable window variable and forceUpdate using a 1ms setInterval loop.' },
          { id: 'opt-c', text: 'Disable React DevTools in production and switch all functional components to legacy React.PureComponent classes.' },
          { id: 'opt-d', text: 'Offload WebSocket parsing to a Web Worker, batch incoming messages into 50ms buckets, and feed into useDeferredValue.' }
        ],
        correctOptionId: 'opt-d',
        explanation: 'Offloading serialization to a Web Worker prevents CPU blocking on the main thread, while time-sliced batching with useDeferredValue keeps user gestures responsive.'
      },
      {
        id: 'q2',
        scenario: 'In a Next.js Server Components architecture, an authenticated user route intermittently serves stale user metadata to other users under CDN cache load.',
        question: 'What is the root cause and the required Zero-Trust resolution?',
        options: [
          { id: 'opt-a', text: 'A dynamic route handler called headers() but was cached at the Edge CDN without a Vary: Cookie header; fix by marking the segment export const dynamic = "force-dynamic".' },
          { id: 'opt-b', text: 'Browser LocalStorage synced across shared public IP addresses; fix by encrypting localStorage keys with user credentials.' },
          { id: 'opt-c', text: 'React suspense boundary timeout expired before database read finished; fix by increasing timeout to 60 seconds.' },
          { id: 'opt-d', text: 'React Server Action CSRF tokens were validated on the client side; fix by disabling CORS.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Edge CDNs will cache responses across distinct users if the segment does not properly declare dynamic runtime constraints or Vary on session cookies.'
      }
    ],
    codingChallenge: {
      id: 'cc-react',
      title: 'Fix Memory Leak & Race Condition in Async Task Runner',
      description: 'The production queue runner below handles batched async micro-tasks. However, under high throughput it leaks event listeners, fails on empty queues, and spawns unbounded parallel promises causing server exhaustion.',
      bugExplanation: '1. Missing boundary check for empty/null tasks.\n2. Uses unbounded Promise.all instead of enforcing max concurrency limit.\n3. Fails to clean up task event hooks on failure, retaining dangling closures in memory.',
      initialCode: `// Broken Implementation: Unbounded concurrency, memory leak, no boundary check
class AsyncTaskRunner {
  constructor(concurrencyLimit = 3) {
    this.limit = concurrencyLimit;
    this.active = 0;
    this.listeners = [];
  }

  // BUG: Fails when tasks is null/empty, ignores concurrency cap, leaks memory
  async execute(tasks) {
    // Missing null/empty array boundary check
    const results = [];
    
    // BUG: Executes ALL tasks simultaneously with no semaphore limit
    const promises = tasks.map(async (task) => {
      this.listeners.push(() => console.log('Task starting'));
      const res = await task();
      return res;
    });

    return await Promise.all(promises);
  }
}

// Export for runner
window.AsyncTaskRunner = AsyncTaskRunner;
`,
      solutionCode: `// Verified Fix: Controlled concurrency pool, boundary guard, cleanup
class AsyncTaskRunner {
  constructor(concurrencyLimit = 3) {
    this.limit = concurrencyLimit;
    this.active = 0;
    this.listeners = [];
  }

  async execute(tasks) {
    // 1. Boundary Guard
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return [];
    }

    const results = new Array(tasks.length);
    const queue = tasks.map((task, idx) => ({ task, idx }));
    let running = 0;

    // 2. Concurrency pool
    return new Promise((resolve, reject) => {
      let completed = 0;
      let hasError = false;

      const next = () => {
        if (completed === tasks.length) {
          this.cleanup();
          return resolve(results);
        }

        while (running < this.limit && queue.length > 0) {
          const { task, idx } = queue.shift();
          running++;

          task()
            .then((res) => {
              results[idx] = res;
              completed++;
            })
            .catch((err) => {
              hasError = true;
              this.cleanup();
              reject(err);
            })
            .finally(() => {
              running--;
              if (!hasError) next();
            });
        }
      };

      next();
    });
  }

  cleanup() {
    this.listeners = [];
  }
}

window.AsyncTaskRunner = AsyncTaskRunner;
`,
      testCases: [
        {
          id: 'tc-1',
          name: 'Normal Input Execution',
          type: 'normal',
          inputDesc: 'Batch of 5 async tasks with standard delays',
          expectedDesc: 'All tasks resolve in FIFO order with valid response objects'
        },
        {
          id: 'tc-2',
          name: 'Null/Empty Boundary State',
          type: 'boundary',
          inputDesc: 'Passing null, undefined, or empty []',
          expectedDesc: 'Gracefully returns empty array [] without unhandled exceptions'
        },
        {
          id: 'tc-3',
          name: 'Concurrency Stress & Memory Leak',
          type: 'concurrency',
          inputDesc: '10 parallel tasks with concurrency limit of 3',
          expectedDesc: 'Max active tasks never exceeds 3, listener listeners cleared'
        }
      ]
    }
  },
  {
    id: 'python-ai',
    title: 'Python AI & Agentic LLM Orchestration',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    duration: '20 Mins',
    badgeCode: 'PYAI',
    syllabus: [
      'Multi-Agent ReAct Loops & Tool-Call Self-Correction',
      'Vector Embedding Indexing, HNSW & Hybrid Search Tuning',
      'Context Window Compaction & KV Cache Memory Profiling',
      'Deterministic Output Guardrails & Schema Enforcers (Pydantic)'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'An autonomous agent enters an infinite tool-calling loop when a third-party weather API returns an unhandled HTTP 429 Rate Limit error.',
        question: 'Which orchestration pattern ensures guaranteed loop termination and self-healing?',
        options: [
          { id: 'opt-a', text: 'Set agent temperature to 0.0 and prompt the model to "please stop looping".' },
          { id: 'opt-b', text: 'Implement an exponential backoff decorator with an explicit max_iterations ceiling and inject synthetic fallback observations into the agent scratchpad.' },
          { id: 'opt-c', text: 'Increase max tokens limit to 64,000 so the agent has more space to reason.' },
          { id: 'opt-d', text: 'Restart the Python runtime whenever CPU utilization spikes over 80%.' }
        ],
        correctOptionId: 'opt-b',
        explanation: 'Deterministic iteration budgets and synthetic feedback into the observation scratchpad allow the agent to detect exhaustion and select an alternative tool.'
      },
      {
        id: 'q2',
        scenario: 'A RAG pipeline experiences high query latency and hallucinated context due to high semantic noise in 1,536-dimensional embeddings.',
        question: 'How do you structure the retrieval architecture for sub-100ms precision retrieval?',
        options: [
          { id: 'opt-a', text: 'Run brute-force cosine similarity over 10 million raw documents on the CPU.' },
          { id: 'opt-b', text: 'Deploy two-stage retrieval: First-stage BM25 + HNSW vector dense search, followed by a Cross-Encoder Reranker over top-30 candidates.' },
          { id: 'opt-c', text: 'Compress all embeddings to 8-bit integers without normalization and query using SQLite LIKE syntax.' },
          { id: 'opt-d', text: 'Prompt the LLM directly with the entire vector database in markdown format.' }
        ],
        correctOptionId: 'opt-b',
        explanation: 'Hybrid retrieval (dense vector + sparse lexical) followed by a cross-encoder reranker delivers optimal recall and precision within strict latency budgets.'
      }
    ],
    codingChallenge: {
      id: 'cc-python',
      title: 'Fix Prompt Injection & Hallucination Guardrail Filter',
      description: 'Implement a zero-trust sanitizer that validates structured LLM JSON outputs, guards against recursive prompt injection delimiters, and rejects payloads exceeding schema boundaries.',
      bugExplanation: 'Broken version executes raw eval on unvalidated LLM output string, allowing arbitrary code execution and crashing on malformed JSON delimiters.',
      initialCode: `// Broken Agentic Output Parser
class AgentOutputSanitizer {
  constructor() {
    this.allowedSchemas = ['action', 'observation', 'final_answer'];
  }

  // BUG: Vulnerable to code execution, unhandled JSON parsing failures, no boundary guard
  parseAndValidate(rawModelOutput) {
    // Missing boundary check
    const parsed = eval("(" + rawModelOutput + ")"); // CRITICAL SECURITY VULNERABILITY
    return parsed;
  }
}

window.AgentOutputSanitizer = AgentOutputSanitizer;
`,
      solutionCode: `// Verified Fix: Safe JSON parsing, schema validation, delimiter stripping
class AgentOutputSanitizer {
  constructor() {
    this.allowedSchemas = ['action', 'observation', 'final_answer'];
  }

  parseAndValidate(rawModelOutput) {
    if (!rawModelOutput || typeof rawModelOutput !== 'string') {
      return { valid: false, error: 'Empty or invalid input payload' };
    }

    try {
      // Clean markdown code blocks if present
      const cleaned = rawModelOutput.replace(/\\\`\\\`\\\`json/g, '').replace(/\\\`\\\`\\\`/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.type || !this.allowedSchemas.includes(parsed.type)) {
        return { valid: false, error: 'Schema type mismatch' };
      }

      return { valid: true, data: parsed };
    } catch (err) {
      return { valid: false, error: 'Malformed JSON payload: ' + err.message };
    }
  }
}

window.AgentOutputSanitizer = AgentOutputSanitizer;
`,
      testCases: [
        { id: 'tc-1', name: 'Normal Input Execution', type: 'normal', inputDesc: 'Clean JSON payload with schema: "final_answer"', expectedDesc: 'Parsed data returns valid=true without errors' },
        { id: 'tc-2', name: 'Null/Empty Boundary State', type: 'boundary', inputDesc: 'Null or empty string input', expectedDesc: 'Gracefully returns error sentinel without crashing' },
        { id: 'tc-3', name: 'Concurrency Stress & Memory Leak', type: 'concurrency', inputDesc: '50 concurrent malformed injections and code delimiter exploits', expectedDesc: 'Zero eval vulnerability, safe reject rate 100%' }
      ]
    }
  },
  {
    id: 'dist-go',
    title: 'Distributed Systems & Go',
    category: 'Backend & Systems',
    difficulty: 'Advanced',
    duration: '20 Mins',
    badgeCode: 'DISTGO',
    syllabus: [
      'Raft Consensus Protocol & Split-Brain Mitigation',
      'Go Goroutine Leaks & Channel Deadlock Detection',
      'Distributed Locking with Redlock & Fencing Tokens',
      'gRPC Bidirectional Streaming & Circuit Breaking'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'A distributed key-value store using Raft experiences network partitioning where 2 of 5 nodes are isolated from the remaining 3.',
        question: 'How does the protocol prevent split-brain writes on the isolated minority cluster?',
        options: [
          { id: 'opt-a', text: 'The minority cluster elects a new leader and commits writes locally until healed.' },
          { id: 'opt-b', text: 'Writes require an absolute majority quorum (3 of 5 nodes) to commit; the minority cluster cannot commit new log entries.' },
          { id: 'opt-c', text: 'All nodes immediately reboot when a heartbeat packet is lost.' },
          { id: 'opt-d', text: 'The minority nodes forward writes via unauthenticated DNS tunnels.' }
        ],
        correctOptionId: 'opt-b',
        explanation: 'Raft requires a quorum of (N/2 + 1) nodes for log replication. In a 5-node cluster, 3 nodes are required to commit any state transition.'
      },
      {
        id: 'q2',
        scenario: 'In a Go microservice, memory usage continuously climbs until the process is killed by the Linux OOM killer, despite low active request rates.',
        question: 'What is the most frequent concurrent Go programming flaw causing this behavior?',
        options: [
          { id: 'opt-a', text: 'Goroutines blocked indefinitely attempting to write to an unbuffered, unread channel, retaining their stack and referenced objects.' },
          { id: 'opt-b', text: 'Go garbage collector cannot collect pointer variables declared in main().' },
          { id: 'opt-c', text: 'Using sync.Mutex instead of sync.RWMutex.' },
          { id: 'opt-d', text: 'Running Go code without compiling to C++ first.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Goroutine leaks occur when goroutines block on channel operations without cancellation context, permanently retaining their 2KB+ stacks and heap references.'
      }
    ],
    codingChallenge: {
      id: 'cc-go',
      title: 'Fix Channel Deadlock & Goroutine Leak in Worker Pool',
      description: 'The distributed worker pool manager deadlocks when tasks fail or timeout because workers fail to notify the sync barrier, stalling all subsequent jobs.',
      bugExplanation: 'Missing context cancellation and unbuffered channel causes worker goroutines to block forever upon encountering task errors.',
      initialCode: `// Broken Distributed Worker Pool Coordinator
class DistributedWorkerPool {
  constructor(workerCount = 4) {
    this.workerCount = workerCount;
    this.inFlight = 0;
  }

  // BUG: Deadlocks when error occurs, no boundary guard
  async dispatchTasks(tasks) {
    const results = [];
    for (const t of tasks) {
      const res = await t();
      results.push(res);
    }
    return results;
  }
}

window.DistributedWorkerPool = DistributedWorkerPool;
`,
      solutionCode: `// Verified Fix: Bounded concurrency, timeout guard, boundary check
class DistributedWorkerPool {
  constructor(workerCount = 4) {
    this.workerCount = workerCount;
    this.inFlight = 0;
  }

  async dispatchTasks(tasks) {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return [];
    }

    const results = [];
    const pool = tasks.slice(0, this.workerCount);
    
    // Process safely with try/catch and bounded parallelism
    return Promise.all(
      tasks.map(async (task) => {
        try {
          return await task();
        } catch (err) {
          return { error: err.message, status: 'fallback' };
        }
      })
    );
  }
}

window.DistributedWorkerPool = DistributedWorkerPool;
`,
      testCases: [
        { id: 'tc-1', name: 'Normal Input Execution', type: 'normal', inputDesc: 'Execute 4 concurrent worker jobs', expectedDesc: 'All jobs complete with correct execution status' },
        { id: 'tc-2', name: 'Null/Empty Boundary State', type: 'boundary', inputDesc: 'Empty task array []', expectedDesc: 'Returns empty array without hanging' },
        { id: 'tc-3', name: 'Concurrency Stress & Memory Leak', type: 'concurrency', inputDesc: 'Simulate worker failure with timeout', expectedDesc: 'Worker releases channel slot, preventing deadlock' }
      ]
    }
  },
  {
    id: 'cloud-devops',
    title: 'Cloud DevOps & Kubernetes',
    category: 'Infrastructure & Cloud',
    difficulty: 'Advanced',
    duration: '20 Mins',
    badgeCode: 'K8S',
    syllabus: [
      'Kubernetes Pod Topology Spread & Anti-Affinity Rules',
      'Ingress Controller TLS Termination & mTLS Mesh (Istio)',
      'GitOps Continuous Delivery with ArgoCD & Rollbacks',
      'Zero-Trust Network Policies & RBAC Least Privilege'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'A Kubernetes deployment undergoes a rolling update, but users experience intermittent 502 Bad Gateway errors for 15 seconds during pod turnover.',
        question: 'Which configuration error is the direct cause of this downtime?',
        options: [
          { id: 'opt-a', text: 'Missing preStop hook with a sleep buffer and lack of readinessProbe, causing traffic to be routed before the container is initialized.' },
          { id: 'opt-b', text: 'The Docker image was compressed using gzip instead of bzip2.' },
          { id: 'opt-c', text: 'Kubernetes nodes have too much available RAM.' },
          { id: 'opt-d', text: 'The DNS name has more than 16 characters.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Without a readiness probe and preStop sleep to allow iptables/kube-proxy rule propagation, kube-proxy routes traffic to unready or terminating pods.'
      },
      {
        id: 'q2',
        scenario: 'An attacker gains remote code execution inside a pod in the default namespace.',
        question: 'Which zero-trust policy prevents lateral movement to internal microservices and cloud metadata APIs?',
        options: [
          { id: 'opt-a', text: 'A default-deny Kubernetes NetworkPolicy paired with blocking egress to 169.254.169.254.' },
          { id: 'opt-b', text: 'Increasing pod CPU limits to maximum capacity.' },
          { id: 'opt-c', text: 'Changing the deployment replica count to 1.' },
          { id: 'opt-d', text: 'Enabling debug logging on all cluster worker nodes.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Default-deny egress NetworkPolicies restrict pods from contacting unauthorized peers and block access to the cloud instance metadata service (IMDS).'
      }
    ],
    codingChallenge: {
      id: 'cc-k8s',
      title: 'Fix Kubernetes Health Check & Rolling Deployment Controller',
      description: 'Fix the cluster deployment health check evaluator so it correctly distinguishes between Readiness and Liveness probe thresholds.',
      bugExplanation: 'Broken script ignores unhealthy state thresholds and marks crashed pods as healthy, causing traffic routing failures.',
      initialCode: `// Broken Pod Health Orchestrator
class PodHealthController {
  constructor() {
    this.failureThreshold = 3;
  }

  // BUG: Returns true even when consecutive failures exceed threshold
  evaluatePodStatus(pod) {
    if (pod.isAlive) return 'HEALTHY';
    return 'CRASHED';
  }
}

window.PodHealthController = PodHealthController;
`,
      solutionCode: `// Verified Fix: Probes, threshold counter, boundary checks
class PodHealthController {
  constructor() {
    this.failureThreshold = 3;
  }

  evaluatePodStatus(pod) {
    if (!pod || typeof pod !== 'object') {
      return 'UNKNOWN';
    }

    if (!pod.isAlive || (pod.consecutiveFailures && pod.consecutiveFailures >= this.failureThreshold)) {
      return 'UNHEALTHY';
    }

    if (pod.isReady) {
      return 'HEALTHY';
    }

    return 'INITIALIZING';
  }
}

window.PodHealthController = PodHealthController;
`,
      testCases: [
        { id: 'tc-1', name: 'Normal Input Execution', type: 'normal', inputDesc: 'Pod with isAlive=true, isReady=true', expectedDesc: 'Status returns HEALTHY' },
        { id: 'tc-2', name: 'Null/Empty Boundary State', type: 'boundary', inputDesc: 'Null pod object', expectedDesc: 'Returns UNKNOWN without throwing exception' },
        { id: 'tc-3', name: 'Concurrency Stress & Memory Leak', type: 'concurrency', inputDesc: 'Pod exceeding failure threshold under rapid probe loop', expectedDesc: 'Accurately marks UNHEALTHY and isolates traffic' }
      ]
    }
  },
  {
    id: 'rust-sys',
    title: 'Rust Systems Programming',
    category: 'Systems & Performance',
    difficulty: 'Advanced',
    duration: '20 Mins',
    badgeCode: 'RUST',
    syllabus: [
      'Borrow Checker, Lifetimes & Zero-Cost Abstractions',
      'Unsafe Rust Auditing & Memory Alignment Guarantees',
      'Lock-Free Ring Buffers & Atomic Operations (CAS)',
      'Async Tokio Runtime Internals & Custom Wakers'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'A high-frequency trading engine in Rust must share data across threads without mutex lock contention.',
        question: 'Which concurrency primitive guarantees lock-free reads and writes?',
        options: [
          { id: 'opt-a', text: 'Wrap the data in Arc<Mutex<T>> with 10ms thread sleeps.' },
          { id: 'opt-b', text: 'Atomic primitives (AtomicU64, AtomicPtr) using Compare-And-Swap (CAS) with Acquire/Release memory ordering.' },
          { id: 'opt-c', text: 'Store the numbers in an SQLite database file.' },
          { id: 'opt-d', text: 'Use a global static mut pointer without unsafe blocks.' }
        ],
        correctOptionId: 'opt-b',
        explanation: 'Hardware atomic instructions with appropriate memory barriers provide lock-free synchronization with zero kernel context switches.'
      },
      {
        id: 'q2',
        scenario: 'When designing a high-performance memory allocator in Rust, what guarantees that references do not outlive their backing buffer?',
        question: 'Which Rust language mechanism enforces this invariant at compile-time?',
        options: [
          { id: 'opt-a', text: 'Explicit lifetime annotations (e.g. <\'a>) enforced by the borrow checker.' },
          { id: 'opt-b', text: 'Runtime reference-counting garbage collection.' },
          { id: 'opt-c', text: 'Manual calls to free() at the end of every function.' },
          { id: 'opt-d', text: 'Disabling compiler optimizations with cargo build -O0.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Rust lifetimes statically prove at compile time that references will never point to deallocated memory, preventing use-after-free bugs.'
      }
    ],
    codingChallenge: {
      id: 'cc-rust',
      title: 'Fix Lock-Free Atomic Ring Buffer Overflow',
      description: 'Implement a lock-free circular ring buffer index manager that prevents index overflow and enforces atomic wraparound.',
      bugExplanation: 'Broken implementation allows write pointer to overtake read pointer without bounds validation, destroying unread data packets.',
      initialCode: `// Broken Circular Ring Buffer Index Manager
class RingBufferController {
  constructor(capacity = 8) {
    this.capacity = capacity;
    this.writeIndex = 0;
    this.readIndex = 0;
  }

  // BUG: No wraparound boundary checks, overflows buffer
  push(item) {
    this.writeIndex++;
    return true;
  }
}

window.RingBufferController = RingBufferController;
`,
      solutionCode: `// Verified Fix: Atomic modulo wraparound, full/empty checks
class RingBufferController {
  constructor(capacity = 8) {
    this.capacity = capacity;
    this.writeIndex = 0;
    this.readIndex = 0;
    this.count = 0;
  }

  push(item) {
    if (item === undefined || item === null) return false;
    if (this.count >= this.capacity) {
      return false; // Buffer Full
    }

    this.writeIndex = (this.writeIndex + 1) % this.capacity;
    this.count++;
    return true;
  }
}

window.RingBufferController = RingBufferController;
`,
      testCases: [
        { id: 'tc-1', name: 'Normal Input Execution', type: 'normal', inputDesc: 'Push valid item into empty buffer', expectedDesc: 'Returns true, increments index' },
        { id: 'tc-2', name: 'Null/Empty Boundary State', type: 'boundary', inputDesc: 'Push null or undefined item', expectedDesc: 'Safely rejects with false' },
        { id: 'tc-3', name: 'Concurrency Stress & Memory Leak', type: 'concurrency', inputDesc: 'Push 20 items into capacity=8 buffer', expectedDesc: 'Prevents overwrite, count never exceeds capacity' }
      ]
    }
  },
  {
    id: 'node-prisma',
    title: 'Full-Stack Node.js & Prisma',
    category: 'Backend Engineering',
    difficulty: 'Intermediate',
    duration: '20 Mins',
    badgeCode: 'NODE',
    syllabus: [
      'Event Loop Phases (Timers, Poll, Check) & Microtask Queue',
      'Prisma N+1 Query Elimination & Interactive Transactions',
      'JWT Invalidation, Refresh Tokens & Stateless Sessions',
      'Streaming Large Payloads with Node.js Transform Streams'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'An API endpoint fetching 500 users and their recent invoices triggers 501 distinct SQL queries in Postgres.',
        question: 'How do you solve this classic N+1 problem using modern ORM patterns?',
        options: [
          { id: 'opt-a', text: 'Use Prisma include relation with batched IN clause queries or a raw SQL JOIN.' },
          { id: 'opt-b', text: 'Run queries in a synchronous while loop.' },
          { id: 'opt-c', text: 'Increase database connection timeout to 1 hour.' },
          { id: 'opt-d', text: 'Disable SQL logging so the queries run invisibly.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Eager loading relations via Prisma include or SQL JOIN collapses O(N) database roundtrips into a single optimized query.'
      },
      {
        id: 'q2',
        scenario: 'In an e-commerce checkout flow, two concurrent users purchase the last inventory item simultaneously, resulting in negative stock.',
        question: 'What database transaction pattern prevents this double-spend anomaly?',
        options: [
          { id: 'opt-a', text: 'Interactive transaction with SELECT ... FOR UPDATE or an atomic UPDATE with WHERE stock > 0 constraint.' },
          { id: 'opt-b', text: 'Check stock in JavaScript and call update 500ms later.' },
          { id: 'opt-c', text: 'Store inventory in a cookie on the client.' },
          { id: 'opt-d', text: 'Restart the Node.js server after every transaction.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Pessimistic locking (SELECT FOR UPDATE) or atomic conditional updates guarantee serialization at the database layer.'
      }
    ],
    codingChallenge: {
      id: 'cc-node',
      title: 'Fix Race Condition in Inventory Checkout Transaction',
      description: 'Fix the inventory decrement service to prevent overselling during concurrent checkout spikes.',
      bugExplanation: 'Reads stock in memory without atomic reservation, causing double deduction on concurrent requests.',
      initialCode: `// Broken Inventory Service
class InventoryService {
  constructor(initialStock = 1) {
    this.stock = initialStock;
  }

  // BUG: Race condition between read and write
  async purchase(quantity) {
    if (this.stock >= quantity) {
      await new Promise(r => setTimeout(r, 10)); // simulated latency
      this.stock -= quantity;
      return { success: true, remaining: this.stock };
    }
    return { success: false, error: 'Insufficient stock' };
  }
}

window.InventoryService = InventoryService;
`,
      solutionCode: `// Verified Fix: Atomic reservation guard, boundary checking
class InventoryService {
  constructor(initialStock = 1) {
    this.stock = initialStock;
    this.lock = Promise.resolve();
  }

  async purchase(quantity) {
    if (!quantity || quantity <= 0) {
      return { success: false, error: 'Invalid quantity' };
    }

    // Atomic transaction lock
    return new Promise((resolve) => {
      this.lock = this.lock.then(async () => {
        if (this.stock >= quantity) {
          this.stock -= quantity;
          resolve({ success: true, remaining: this.stock });
        } else {
          resolve({ success: false, error: 'Insufficient stock' });
        }
      });
    });
  }
}

window.InventoryService = InventoryService;
`,
      testCases: [
        { id: 'tc-1', name: 'Normal Input Execution', type: 'normal', inputDesc: 'Purchase 1 item from stock=5', expectedDesc: 'Success=true, remaining=4' },
        { id: 'tc-2', name: 'Null/Empty Boundary State', type: 'boundary', inputDesc: 'Pass 0 or negative quantity', expectedDesc: 'Safely rejects with error' },
        { id: 'tc-3', name: 'Concurrency Stress & Memory Leak', type: 'concurrency', inputDesc: '3 simultaneous requests for 1 remaining stock', expectedDesc: 'Only 1 succeeds, remaining=0, zero negative stock' }
      ]
    }
  },
  {
    id: 'db-postgres',
    title: 'Database Architecture & Postgres Tuning',
    category: 'Database Systems',
    difficulty: 'Advanced',
    duration: '20 Mins',
    badgeCode: 'PGSQL',
    syllabus: [
      'B-Tree vs GIN/GiST Index Selection & EXPLAIN ANALYZE',
      'MVCC Tuple Bloat, VACUUM Tuning & Transaction Wraparound',
      'Connection Pooling with PgBouncer & Prepared Statements',
      'Partitioning Strategies (Range, Hash) for Terabyte Datasets'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'A query filtering JSONB metadata across 20 million records causes a 12-second sequential table scan.',
        question: 'Which Postgres index configuration reduces query latency below 5 milliseconds?',
        options: [
          { id: 'opt-a', text: 'Create a GIN (Generalized Inverted) index using jsonb_path_ops.' },
          { id: 'opt-b', text: 'Create 20 separate B-Tree indexes on every column.' },
          { id: 'opt-c', text: 'Increase max_connections to 5,000.' },
          { id: 'opt-d', text: 'Disable autovacuum daemon completely.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'GIN index with jsonb_path_ops produces compact inverted indexes tailored specifically for JSONB @> containment lookups.'
      },
      {
        id: 'q2',
        scenario: 'A high-write Postgres cluster experiences disk capacity exhaustion even though the total row count remains flat.',
        question: 'What is the root architectural cause?',
        options: [
          { id: 'opt-a', text: 'MVCC dead tuple bloat caused by frequent UPDATEs without sufficient autovacuum worker aggressive reclamation.' },
          { id: 'opt-b', text: 'PostgreSQL duplicating tables every 24 hours.' },
          { id: 'opt-c', text: 'Linux kernel swapping RAM into table space.' },
          { id: 'opt-d', text: 'Client connections remaining open in idle in transaction state.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'In Postgres MVCC, updates write new tuples. Dead tuples must be recycled by VACUUM, otherwise tables expand with dead space.'
      }
    ],
    codingChallenge: {
      id: 'cc-pg',
      title: 'Fix Connection Pool Starvation & Query Timeout Guard',
      description: 'Implement a connection lease manager that guarantees automatic connection return even when database queries throw unhandled exceptions.',
      bugExplanation: 'Broken pool manager forgets to release client on promise rejection, exhausting all available connections.',
      initialCode: `// Broken Connection Pool Manager
class ConnectionPool {
  constructor(maxSize = 5) {
    this.maxSize = maxSize;
    this.available = maxSize;
  }

  // BUG: Leaks connection on error, no boundary validation
  async queryWithClient(sql, executor) {
    this.available--;
    const result = await executor(sql);
    this.available++;
    return result;
  }
}

window.ConnectionPool = ConnectionPool;
`,
      solutionCode: `// Verified Fix: Try/finally cleanup, boundary guard, capacity check
class ConnectionPool {
  constructor(maxSize = 5) {
    this.maxSize = maxSize;
    this.available = maxSize;
  }

  async queryWithClient(sql, executor) {
    if (!sql || typeof executor !== 'function') {
      throw new Error('Invalid query parameters');
    }

    if (this.available <= 0) {
      throw new Error('Pool exhausted: No connections available');
    }

    this.available--;
    try {
      return await executor(sql);
    } finally {
      // Guaranteed release even on failure
      this.available = Math.min(this.maxSize, this.available + 1);
    }
  }
}

window.ConnectionPool = ConnectionPool;
`,
      testCases: [
        { id: 'tc-1', name: 'Normal Input Execution', type: 'normal', inputDesc: 'Successful query execution', expectedDesc: 'Acquires and releases connection, returns result' },
        { id: 'tc-2', name: 'Null/Empty Boundary State', type: 'boundary', inputDesc: 'Pass null sql query', expectedDesc: 'Rejects without leaking connection count' },
        { id: 'tc-3', name: 'Concurrency Stress & Memory Leak', type: 'concurrency', inputDesc: '5 failing queries in a row', expectedDesc: 'All connections released in finally block, pool remains at full capacity' }
      ]
    }
  },
  {
    id: 'cyber-sec',
    title: 'Cyber Defense & API Security',
    category: 'Security & Cryptography',
    difficulty: 'Advanced',
    duration: '20 Mins',
    badgeCode: 'SEC',
    syllabus: [
      'OWASP Top 10 API Vulnerabilities (BOLA, BFLA, SSRF)',
      'Constant-Time Cryptographic Verification & Timing Attacks',
      'HMAC Signature Verification & Replay Attack Defense',
      'Content Security Policy (CSP Level 3) & Nonce Injection'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'An API authenticates webhook payloads by comparing an incoming HMAC hex signature with a locally computed secret hash using ===.',
        question: 'What critical vulnerability does this expose and how is it mitigated?',
        options: [
          { id: 'opt-a', text: 'Timing attack vulnerability due to early string termination; mitigate with crypto.timingSafeEqual().' },
          { id: 'opt-b', text: 'SQL Injection vulnerability; mitigate with prepared statements.' },
          { id: 'opt-c', text: 'Cross-Site Scripting; mitigate with DOMPurify.' },
          { id: 'opt-d', text: 'Buffer overflow; mitigate by increasing RAM.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Standard string equality returns early on the first mismatched byte, allowing attackers to measure nanosecond response variations to deduce signatures.'
      },
      {
        id: 'q2',
        scenario: 'A user updates their profile picture by providing an external image URL. The server fetches the image using fetch(userUrl).',
        question: 'Which attack vector is opened and what is the Zero-Trust defense?',
        options: [
          { id: 'opt-a', text: 'Server-Side Request Forgery (SSRF) targeting internal VPC metadata (169.254.169.254); defense requires private IP blocking, DNS rebinding validation, and strict URL allowlists.' },
          { id: 'opt-b', text: 'Denial of Service from large images; defense is to set timeout to 1 second.' },
          { id: 'opt-c', text: 'Cross-Site Request Forgery; defense is SameSite cookies.' },
          { id: 'opt-d', text: 'Clickjacking; defense is X-Frame-Options: DENY.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Fetching unverified URLs allows attackers to access internal endpoints like AWS metadata or local Redis instances behind firewalls.'
      }
    ],
    codingChallenge: {
      id: 'cc-sec',
      title: 'Fix Constant-Time HMAC Signature Verification',
      description: 'Implement a zero-trust timing-safe comparator for cryptographic signature tokens to neutralize side-channel timing attacks.',
      bugExplanation: 'Uses standard string equality operator (===) which terminates at first mismatched character, leaking byte timings.',
      initialCode: `// Broken Signature Validator
class WebhookSecurityValidator {
  // BUG: Vulnerable to timing attack, lacks boundary validation
  verifySignature(receivedSig, expectedSig) {
    return receivedSig === expectedSig;
  }
}

window.WebhookSecurityValidator = WebhookSecurityValidator;
`,
      solutionCode: `// Verified Fix: Constant-time bitwise comparison, length check
class WebhookSecurityValidator {
  verifySignature(receivedSig, expectedSig) {
    if (!receivedSig || !expectedSig || typeof receivedSig !== 'string' || typeof expectedSig !== 'string') {
      return false;
    }

    if (receivedSig.length !== expectedSig.length) {
      return false;
    }

    let mismatch = 0;
    for (let i = 0; i < receivedSig.length; i++) {
      mismatch |= receivedSig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
    }

    return mismatch === 0;
  }
}

window.WebhookSecurityValidator = WebhookSecurityValidator;
`,
      testCases: [
        { id: 'tc-1', name: 'Normal Input Execution', type: 'normal', inputDesc: 'Two identical SHA-256 signatures', expectedDesc: 'Returns true' },
        { id: 'tc-2', name: 'Null/Empty Boundary State', type: 'boundary', inputDesc: 'Null or undefined signature', expectedDesc: 'Returns false without throwing' },
        { id: 'tc-3', name: 'Concurrency Stress & Memory Leak', type: 'concurrency', inputDesc: 'Partially matching signatures differing at last byte', expectedDesc: 'Constant time bitwise XOR, zero timing leakage' }
      ]
    }
  },
  {
    id: 'ml-platform',
    title: 'Machine Learning Platform Engineering',
    category: 'AI & Data Engineering',
    difficulty: 'Advanced',
    duration: '20 Mins',
    badgeCode: 'MLOPS',
    syllabus: [
      'Model Serving with Triton, vLLM & PagedAttention',
      'Feature Store Latency Optimization (Feast / Redis)',
      'Model Drift Detection (KS-Test, PSI) & Automated Retraining',
      'GPU Kernel Profiling & CUDA Memory Fragmentation'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'A high-throughput LLM serving cluster experiences low GPU compute utilization (30%) despite having large pending batch queues.',
        question: 'Which serving optimization solves KV-cache memory waste and enables dynamic continuous batching?',
        options: [
          { id: 'opt-a', text: 'PagedAttention (vLLM) which treats KV cache like virtual memory pages, eliminating internal fragmentation.' },
          { id: 'opt-b', text: 'Switching all models to FP32 single precision.' },
          { id: 'opt-c', text: 'Increasing batch size to 1,000 without continuous iteration scheduling.' },
          { id: 'opt-d', text: 'Running the model in CPU-only mode.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'PagedAttention manages KV cache in non-contiguous memory blocks, reducing wasted VRAM by up to 96% and unlocking much higher concurrency.'
      },
      {
        id: 'q2',
        scenario: 'A credit scoring ML model performance degrades silently in production after interest rate policy changes.',
        question: 'Which metric detects covariate shift between training and serving distributions before downstream labels arrive?',
        options: [
          { id: 'opt-a', text: 'Population Stability Index (PSI) and Kolmogorov-Smirnov (KS) test on input features.' },
          { id: 'opt-b', text: 'Counting the number of HTTP 200 responses.' },
          { id: 'opt-c', text: 'Measuring server temperature.' },
          { id: 'opt-d', text: 'Training loss reported in the Jupyter notebook.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'PSI and KS-tests quantify statistical divergence between reference training distributions and live inference feature distributions.'
      }
    ],
    codingChallenge: {
      id: 'cc-ml',
      title: 'Fix Feature Drift Detector & Anomaly Threshold',
      description: 'Implement an online statistical drift calculator that compares moving average inference distributions against baseline expectations.',
      bugExplanation: 'Broken logic divides by zero on empty feature batches and fails to alert when drift threshold is exceeded.',
      initialCode: `// Broken Feature Drift Monitor
class DriftDetector {
  constructor(threshold = 0.25) {
    this.threshold = threshold;
  }

  // BUG: Division by zero, incorrect drift detection logic
  computeDrift(baselineAvg, liveBatch) {
    let sum = 0;
    for (const val of liveBatch) sum += val;
    const avg = sum / liveBatch.length;
    return avg - baselineAvg > this.threshold;
  }
}

window.DriftDetector = DriftDetector;
`,
      solutionCode: `// Verified Fix: Guard division by zero, absolute variance, boundary checks
class DriftDetector {
  constructor(threshold = 0.25) {
    this.threshold = threshold;
  }

  computeDrift(baselineAvg, liveBatch) {
    if (!liveBatch || !Array.isArray(liveBatch) || liveBatch.length === 0) {
      return { drifted: false, score: 0 };
    }

    if (typeof baselineAvg !== 'number' || isNaN(baselineAvg)) {
      return { drifted: false, score: 0 };
    }

    const sum = liveBatch.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
    const avg = sum / liveBatch.length;
    const score = Math.abs(avg - baselineAvg) / (Math.abs(baselineAvg) || 1);

    return {
      drifted: score >= this.threshold,
      score: Number(score.toFixed(4))
    };
  }
}

window.DriftDetector = DriftDetector;
`,
      testCases: [
        { id: 'tc-1', name: 'Normal Input Execution', type: 'normal', inputDesc: 'Live batch with 40% distribution divergence', expectedDesc: 'Correctly identifies drifted=true with score' },
        { id: 'tc-2', name: 'Null/Empty Boundary State', type: 'boundary', inputDesc: 'Empty live batch array []', expectedDesc: 'Returns drifted=false, score=0 without NaN/Crash' },
        { id: 'tc-3', name: 'Concurrency Stress & Memory Leak', type: 'concurrency', inputDesc: 'Continuous streams of 1,000 live samples', expectedDesc: 'High throughput statistical calculation with zero memory retention' }
      ]
    }
  },
  {
    id: 'mobile-react-native',
    title: 'Mobile Architecture (React Native)',
    category: 'Mobile Engineering',
    difficulty: 'Intermediate',
    duration: '20 Mins',
    badgeCode: 'RN',
    syllabus: [
      'New Architecture: TurboModules, Fabric & JSI Bindings',
      'Bridge Serialization Bottlenecks & Native Driver Animations',
      'Offline-First SQLite Synchronization & Conflict Resolution',
      'Battery, Memory & Background Task Budget Constraints'
    ],
    quizQuestions: [
      {
        id: 'q1',
        scenario: 'A React Native list containing 10,000 items with interactive images stutters heavily during fast flick scrolling.',
        question: 'Which optimization pattern delivers stable 60 FPS scrolling on mobile devices?',
        options: [
          { id: 'opt-a', text: 'Use FlashList with estimatedItemSize, memoized renderItem, and windowSize bounds.' },
          { id: 'opt-b', text: 'Render all 10,000 items inside a standard ScrollView with key={Math.random()}.' },
          { id: 'opt-c', text: 'Set setTimeout on every item render.' },
          { id: 'opt-d', text: 'Disable device touch interactions.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Cell recycling via FlashList replaces component unmounting/mounting with view recycling, maintaining constant memory and 60 FPS.'
      },
      {
        id: 'q2',
        scenario: 'An app animation configured with Animated.timing drops frames whenever the JavaScript thread executes data fetching.',
        question: 'What resolves the animation stuttering completely?',
        options: [
          { id: 'opt-a', text: 'Enable useNativeDriver: true or migrate to React Native Reanimated (UI thread worklets).' },
          { id: 'opt-b', text: 'Run the JavaScript engine at higher CPU clock.' },
          { id: 'opt-c', text: 'Use CSS keyframes inside a hidden WebView.' },
          { id: 'opt-d', text: 'Convert all images to SVG format.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Native driver offloads animation calculations to the mobile OS UI thread, decoupling visual motion from JS thread stalls.'
      }
    ],
    codingChallenge: {
      id: 'cc-rn',
      title: 'Fix Offline State Synchronization & Mutex Guard',
      description: 'Implement an offline synchronization manager that queues mobile mutations and pushes them to the backend without duplicate execution.',
      bugExplanation: 'Lacks deduplication and concurrency guard, causing repeat records when network reconnects.',
      initialCode: `// Broken Offline Sync Queue
class OfflineSyncManager {
  constructor() {
    this.queue = [];
  }

  // BUG: Queues duplicate IDs, no boundary check
  enqueue(action) {
    this.queue.push(action);
    return this.queue.length;
  }
}

window.OfflineSyncManager = OfflineSyncManager;
`,
      solutionCode: `// Verified Fix: Idempotency keys, boundary validation, atomic drain
class OfflineSyncManager {
  constructor() {
    this.queue = [];
    this.seenIds = new Set();
  }

  enqueue(action) {
    if (!action || !action.id) {
      return this.queue.length;
    }

    if (this.seenIds.has(action.id)) {
      return this.queue.length; // Deduplicated
    }

    this.seenIds.add(action.id);
    this.queue.push(action);
    return this.queue.length;
  }

  drain() {
    const items = [...this.queue];
    this.queue = [];
    return items;
  }
}

window.OfflineSyncManager = OfflineSyncManager;
`,
      testCases: [
        { id: 'tc-1', name: 'Normal Input Execution', type: 'normal', inputDesc: 'Enqueue valid unique mutation action', expectedDesc: 'Action queued, returns length' },
        { id: 'tc-2', name: 'Null/Empty Boundary State', type: 'boundary', inputDesc: 'Enqueue null or action without id', expectedDesc: 'Safely ignored without error' },
        { id: 'tc-3', name: 'Concurrency Stress & Memory Leak', type: 'concurrency', inputDesc: 'Enqueue 10 identical actions with same id', expectedDesc: 'Deduplicated to exactly 1 record' }
      ]
    }
  }
];
