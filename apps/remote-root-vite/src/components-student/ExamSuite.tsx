import React, { useState, useEffect, useRef } from 'react';
import {
  AlertOctagon,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Maximize2,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Lock
} from 'lucide-react';
import type { Skill, ProctorLog, TimelineEvent } from '../../types';
import { CameraPip } from './CameraPip';
import { runCodeAgainstTests, type ExecutionReport } from '../../utils/codeRunner';
import { playViolationChime } from '../../utils/audio';

interface ExamSuiteProps {
  skill: Skill;
  cameraStream: MediaStream | null;
  useFallbackStream: boolean;
  onSubmitExam: (assessmentData: {
    quizScore: number;
    testReport: ExecutionReport;
    submittedCode: string;
    proctorLog: ProctorLog;
  }) => void;
  onExitExam: () => void;
}

export const ExamSuite: React.FC<ExamSuiteProps> = ({
  skill,
  cameraStream,
  useFallbackStream,
  onSubmitExam,
  onExitExam,
}) => {
  // Telemetry & Proctoring States
  const [integrityScore, setIntegrityScore] = useState(100);
  const [violationCount, setViolationCount] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [clipboardAnomalies, setClipboardAnomalies] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [devtoolsAttempts, setDevtoolsAttempts] = useState(0);
  const [activeAlertMessage, setActiveAlertMessage] = useState<string | null>(null);
  const [isPausedFullscreenExit, setIsPausedFullscreenExit] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: 'init-1',
      timestamp: '00:00',
      type: 'info',
      message: 'Zero-Trust Proctor active. Biometric anchor initialized.'
    }
  ]);

  // Stage A: Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // Stage B: Code Editor State
  const [code, setCode] = useState(skill.codingChallenge.initialCode);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testReport, setTestReport] = useState<ExecutionReport | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'logs'>('editor');

  // Timer
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(1200); // 20 mins

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Helper to log telemetry timeline event
  const logEvent = (type: 'info' | 'warning' | 'violation', message: string) => {
    const elapsedMinutes = Math.floor((1200 - timeRemainingSeconds) / 60);
    const elapsedSecs = (1200 - timeRemainingSeconds) % 60;
    const timeStr = `${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedSecs).padStart(2, '0')}`;

    setTimelineEvents(prev => [
      ...prev,
      {
        id: `ev-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        type,
        message
      }
    ]);
  };

  // Trigger security penalty
  const triggerViolation = (type: 'tab_switch' | 'clipboard' | 'devtools' | 'fullscreen') => {
    playViolationChime();
    setViolationCount(prev => prev + 1);
    setIntegrityScore(prev => Math.max(10, prev - 15));

    let alertText = '';
    if (type === 'tab_switch') {
      setTabSwitches(prev => prev + 1);
      alertText = 'SECURITY ALERT: Tab switch detected. Window blur logged (-15% Integrity).';
      logEvent('violation', 'Window lost focus / Tab switched.');
    } else if (type === 'clipboard') {
      setClipboardAnomalies(prev => prev + 1);
      alertText = 'SECURITY ALERT: Clipboard and context actions are prohibited.';
      logEvent('violation', 'Unauthorized clipboard action blocked.');
    } else if (type === 'devtools') {
      setDevtoolsAttempts(prev => prev + 1);
      alertText = 'SECURITY ALERT: Developer tools access shortcut intercepted.';
      logEvent('warning', 'DevTools key combination blocked.');
    } else if (type === 'fullscreen') {
      setFullscreenExits(prev => prev + 1);
      alertText = 'EXAM PAUSED: Fullscreen exit detected. Return immediately.';
      logEvent('violation', 'User exited fullscreen container.');
    }

    setActiveAlertMessage(alertText);
    setTimeout(() => {
      setActiveAlertMessage(null);
    }, 6000);
  };

  // 1. Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPausedFullscreenExit(true);
        triggerViolation('fullscreen');
      } else {
        setIsPausedFullscreenExit(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 2. Tab Blur & Visibility Tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('tab_switch');
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('tab_switch');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  // 3. Strict Clipboard & DevTools Keyboard Shield
  useEffect(() => {
    const handleCopyCutPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerViolation('clipboard');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation('clipboard');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        triggerViolation('devtools');
      }
      // Block Ctrl+Shift+I or Cmd+Opt+I
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        triggerViolation('devtools');
      }
      // Block Ctrl+C, Ctrl+V, Ctrl+X inside the window if not in code editor
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V' || e.key === 'x' || e.key === 'X')) {
        // Even in editor, warn about external paste
        if (e.key === 'v' || e.key === 'V') {
          e.preventDefault();
          triggerViolation('clipboard');
        }
      }
    };

    window.addEventListener('copy', handleCopyCutPaste, true);
    window.addEventListener('cut', handleCopyCutPaste, true);
    window.addEventListener('paste', handleCopyCutPaste, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('copy', handleCopyCutPaste, true);
      window.removeEventListener('cut', handleCopyCutPaste, true);
      window.removeEventListener('paste', handleCopyCutPaste, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  // 4. Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle Return to Fullscreen
  const handleResumeFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setIsPausedFullscreenExit(false);
    } catch (err) {
      console.warn('Fullscreen resume failed:', err);
      setIsPausedFullscreenExit(false);
    }
  };

  // Run automated test cases
  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      const report = await runCodeAgainstTests(code, skill.id);
      setTestReport(report);
      logEvent(
        report.testsPassed >= 2 ? 'info' : 'warning',
        `Ran test suite: ${report.testsPassed}/${report.totalTests} tests passed.`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Helper button to apply reference fix for live demo walkthrough
  const handleApplyFix = () => {
    setCode(skill.codingChallenge.solutionCode);
  };

  // Calculate Quiz Score
  const calculateQuizScore = () => {
    let correct = 0;
    skill.quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });
    return Math.round((correct / skill.quizQuestions.length) * 100);
  };

  // Final Assessment Submission
  const handleSubmitFinal = () => {
    const finalReport = testReport || {
      success: false,
      testsPassed: 0,
      totalTests: 3,
      results: [],
      logs: ['No tests run.'],
      executionTimeMs: 0
    };

    const proctorLog: ProctorLog = {
      faceDrops: 0,
      faceLockConfirmed: true,
      tabSwitches,
      clipboardAnomalies,
      fullscreenExits,
      devtoolsAttempts,
      integrityScore,
      timelineEvents
    };

    onSubmitExam({
      quizScore: calculateQuizScore(),
      testReport: finalReport,
      submittedCode: code,
      proctorLog
    });
  };

  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const canSubmit = (testReport?.testsPassed || 0) >= 2;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-none">
      {/* Red Alert Banner for Security Telemetry */}
      {activeAlertMessage && (
        <div className="sticky top-0 z-50 bg-alert-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-semibold animate-in slide-in-from-top duration-200">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
            <AlertOctagon className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span>{activeAlertMessage}</span>
          </div>
        </div>
      )}

      {/* Top Telemetry Exam Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-trust-100 text-trust-700 flex items-center justify-center border border-trust-200">
              <Lock className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">{skill.title}</h2>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                <span className="font-semibold text-trust-600">ZERO-TRUST LOCKDOWN ACTIVE</span>
                <span>•</span>
                <span>Tier: {skill.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Center: Live Anti-Cheat Gauge */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Proctor Integrity</p>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-sm font-extrabold ${integrityScore >= 80 ? 'text-trust-600' : 'text-alert-600'}`}>
                    {integrityScore}%
                  </span>
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        integrityScore >= 80 ? 'bg-trust-500' : integrityScore >= 50 ? 'bg-amber-500' : 'bg-alert-500'
                      }`}
                      style={{ width: `${integrityScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Violations</p>
                <span className={`text-sm font-mono font-bold ${violationCount > 0 ? 'text-alert-600' : 'text-slate-700'}`}>
                  {violationCount}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-slate-600" />
              <span className="font-mono text-sm font-bold text-slate-900">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={onExitExam}
              className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Left Column: Stage A Quiz + Stage B Problem Statement (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stage A: Architecture Quiz */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle select-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-trust-100 text-trust-700 font-bold text-xs flex items-center justify-center">
                  A
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Stage A: Scenario Architecture Quiz</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">2 Questions</span>
            </div>

            <div className="mt-4 space-y-6">
              {skill.quizQuestions.map((q, qIdx) => (
                <div key={q.id} className="space-y-2.5">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      Scenario {qIdx + 1}
                    </p>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-mono">
                      {q.scenario}
                    </p>
                  </div>

                  <p className="text-xs font-semibold text-slate-900">{q.question}</p>

                  <div className="space-y-1.5">
                    {q.options.map(opt => {
                      const isSelected = selectedAnswers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start space-x-2.5 ${
                            isSelected
                              ? 'bg-trust-50/80 border-trust-400 text-trust-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'border-trust-600 bg-trust-600 text-white'
                                : 'border-slate-300 text-slate-400'
                            }`}
                          >
                            {opt.id.replace('opt-', '').toUpperCase()}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stage B Problem Statement & Test Specs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-subtle select-none">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                B
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Stage B: Code Debugging Challenge</h3>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">
                {skill.codingChallenge.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {skill.codingChallenge.description}
              </p>

              <div className="bg-alert-50 border border-alert-200 rounded-xl p-3 text-xs text-alert-900 space-y-1">
                <p className="font-bold flex items-center space-x-1 text-alert-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Identified Production Defects:</span>
                </p>
                <pre className="whitespace-pre-wrap font-sans text-xs leading-normal">
                  {skill.codingChallenge.bugExplanation}
                </pre>
              </div>

              {/* Required Test Case Benchmarks */}
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Validation Benchmark Suite (Pass 2/3 to Submit)
                </p>
                <div className="space-y-1.5">
                  {skill.codingChallenge.testCases.map((tc, idx) => (
                    <div
                      key={tc.id}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-800">Test {idx + 1}: {tc.name}</span>
                        <p className="text-slate-500">{tc.expectedDesc}</p>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600">
                        {tc.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor + Floating PIP + Automated Test Suite (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Top Bar for Code Editor */}
          <div className="bg-slate-900 rounded-t-2xl px-4 py-3 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <span className="font-mono text-xs text-slate-300 font-medium">
                solution.{skill.id === 'react-arch' ? 'tsx' : 'js'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Quick Demo Fix Helper */}
              <button
                onClick={handleApplyFix}
                className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-trust-400 border border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                title="Paste verified reference solution for rapid testing"
              >
                <Sparkles className="w-3 h-3" />
                <span>Apply Solution Fix</span>
              </button>

              <button
                onClick={() => setCode(skill.codingChallenge.initialCode)}
                className="p-1 text-slate-400 hover:text-slate-200"
                title="Reset to broken initial code"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* In-Browser Code Editor Area */}
          <div className="relative bg-slate-950 border-x border-slate-800 flex-1 min-h-[380px] font-mono text-xs overflow-hidden flex">
            {/* Line Numbers */}
            <div className="w-10 bg-slate-900/60 py-3 text-right pr-2 text-slate-600 select-none border-r border-slate-800">
              {code.split('\n').map((_, i) => (
                <div key={i} className="leading-5 h-5 text-[11px]">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editable Codearea */}
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent text-slate-100 p-3 outline-none resize-none leading-5 font-mono text-xs selection:bg-slate-800"
              style={{ minHeight: '380px' }}
            />

            {/* Floating Camera PIP Monitor pinned in the top-right corner of code workbench */}
            <div className="absolute top-3 right-3 z-20">
              <CameraPip
                stream={cameraStream}
                useFallback={useFallbackStream}
                isPaused={isPausedFullscreenExit}
              />
            </div>
          </div>

          {/* Test Runner & Status Pod */}
          <div className="bg-white border border-slate-200 rounded-b-2xl p-4 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {isRunningTests ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Automated Suite...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Automated Test Cases</span>
                    </>
                  )}
                </button>

                {testReport && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    testReport.testsPassed >= 2
                      ? 'bg-trust-50 text-trust-700 border border-trust-200'
                      : 'bg-alert-50 text-alert-700 border border-alert-200'
                  }`}>
                    {testReport.testsPassed} / {testReport.totalTests} Tests Passed
                  </span>
                )}
              </div>

              {/* Output Tab Switcher */}
              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    activeTab === 'editor' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500'
                  }`}
                >
                  Test Results
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    activeTab === 'logs' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500'
                  }`}
                >
                  Execution Logs
                </button>
              </div>
            </div>

            {/* Test Results Display */}
            {testReport && activeTab === 'editor' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {testReport.results.map((r, i) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      r.passed
                        ? 'bg-trust-50/50 border-trust-200 text-trust-900'
                        : 'bg-alert-50/50 border-alert-200 text-alert-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px]">Test Case {i + 1}</span>
                      {r.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-trust-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-alert-500" />
                      )}
                    </div>
                    <p className="font-semibold text-slate-800 text-[11px]">{r.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{r.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Execution Logs */}
            {testReport && activeTab === 'logs' && (
              <div className="bg-slate-950 rounded-xl p-3 font-mono text-[11px] text-slate-300 max-h-36 overflow-y-auto space-y-1">
                {testReport.logs.map((log, lIdx) => (
                  <div key={lIdx} className={log.includes('ERR') || log.includes('FATAL') ? 'text-red-400' : 'text-emerald-400'}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {!testReport && (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                Click "Run Automated Test Cases" to execute the test suite against your code fix.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="sticky bottom-0 z-30 bg-white border-t border-slate-200 py-3.5 px-4 sm:px-6 shadow-elevated">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span className="hidden sm:inline">Stage A Quiz: {Object.keys(selectedAnswers).length}/2 Answered</span>
            <span className="hidden sm:inline">•</span>
            <span>
              Stage B Tests: {testReport ? `${testReport.testsPassed}/3 Passed` : '0/3 Tested'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSubmitFinal}
              disabled={!canSubmit}
              className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                canSubmit
                  ? 'bg-trust-600 hover:bg-trust-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Final Assessment</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Fullscreen Exit Pause Overlay Modal */}
      {isPausedFullscreenExit && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-alert-300 p-6 text-center space-y-4 shadow-elevated">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-alert-100 text-alert-600 flex items-center justify-center">
              <AlertOctagon className="w-8 h-8 stroke-[2.2] animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">EXAM PAUSED: Fullscreen Exit Detected</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero-Trust lockdown rules require continuous fullscreen focus. This incident has been logged to your proctoring audit record and deducted 15% from your Integrity Score.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResumeFullscreen}
                className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-trust-600 hover:bg-trust-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Return to Fullscreen & Resume Assessment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
