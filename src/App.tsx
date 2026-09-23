import React, { useState } from 'react';
import { TalentProvider, useTalent } from './context/TalentContext';
import { Header } from './components/common/Header';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ProctorSetupModal } from './components/student/ProctorSetupModal';
import { ExamSuite } from './components/student/ExamSuite';
import { BadgeIssuance } from './components/student/BadgeIssuance';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import type { Skill, Badge, ProctorLog } from './types';
import { generateBadgeId, generateSha256 } from './utils/crypto';
import type { ExecutionReport } from './utils/codeRunner';

const StudentAppContent: React.FC = () => {
  const { currentStudent, addEarnedBadge } = useTalent();

  // Student Examination Sub-States
  const [selectedSkillForExam, setSelectedSkillForExam] = useState<Skill | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isInActiveExam, setIsInActiveExam] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [useFallbackStream, setUseFallbackStream] = useState(false);

  // Issued Badge Data
  const [issuedBadgeData, setIssuedBadgeData] = useState<{
    badge: Badge;
    proctorLog: ProctorLog;
    testsPassed: number;
    totalTests: number;
  } | null>(null);

  // When student clicks "Start Secured Examination"
  const handleStartSkillExam = (skill: Skill) => {
    setSelectedSkillForExam(skill);
    setIsSetupModalOpen(true);
  };

  // When student finishes Step 1 & Step 2 setup
  const handleProctorReady = (stream: MediaStream | null, fallback: boolean) => {
    setCameraStream(stream);
    setUseFallbackStream(fallback);
    setIsSetupModalOpen(false);
    setIsInActiveExam(true);
  };

  // When student submits final assessment
  const handleExamSubmission = async (assessmentData: {
    quizScore: number;
    testReport: ExecutionReport;
    submittedCode: string;
    proctorLog: ProctorLog;
  }) => {
    if (!selectedSkillForExam) return;

    const technicalScore = Math.round(
      assessmentData.quizScore * 0.4 +
      ((assessmentData.testReport.testsPassed / assessmentData.testReport.totalTests) * 100) * 0.6
    );

    const proctorScore = assessmentData.proctorLog.integrityScore;
    const overallScore = Math.round((technicalScore * 0.6) + (proctorScore * 0.4));

    // Generate cryptographic hash and badge ID
    const badgeId = generateBadgeId(selectedSkillForExam.badgeCode);
    const hashPayload = `${badgeId}:${currentStudent.name}:${selectedSkillForExam.id}:${overallScore}:${Date.now()}`;
    const sha256Hash = await generateSha256(hashPayload);

    const newBadge: Badge = {
      id: badgeId,
      skillId: selectedSkillForExam.id,
      skillTitle: selectedSkillForExam.title,
      issuedAt: new Date().toISOString(),
      sha256Hash,
      proctorScore,
      technicalScore,
      overallScore,
      verifiedBy: 'TrustHire Zero-Trust Protocol v2.4'
    };

    // Add to student's earned badges in context
    addEarnedBadge(newBadge);

    // Stop real camera tracks if active
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    // Set issued badge state and exit active exam mode
    setIssuedBadgeData({
      badge: newBadge,
      proctorLog: assessmentData.proctorLog,
      testsPassed: assessmentData.testReport.testsPassed,
      totalTests: assessmentData.testReport.totalTests
    });

    setIsInActiveExam(false);
  };

  const handleExitExamEarly = () => {
    if (window.confirm('Are you sure you want to exit the proctored exam? Your progress will not be saved.')) {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      setIsInActiveExam(false);
      setSelectedSkillForExam(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Brand Header */}
      {!isInActiveExam && <Header />}

      {/* Main Flow */}
      <main className="flex-1">
        {isInActiveExam && selectedSkillForExam ? (
          <ExamSuite
            skill={selectedSkillForExam}
            cameraStream={cameraStream}
            useFallbackStream={useFallbackStream}
            onSubmitExam={handleExamSubmission}
            onExitExam={handleExitExamEarly}
          />
        ) : issuedBadgeData ? (
          <BadgeIssuance
            badge={issuedBadgeData.badge}
            proctorLog={issuedBadgeData.proctorLog}
            testsPassed={issuedBadgeData.testsPassed}
            totalTests={issuedBadgeData.totalTests}
            onReturnDashboard={() => {
              setIssuedBadgeData(null);
              setSelectedSkillForExam(null);
            }}
          />
        ) : (
          <StudentDashboard onStartExam={handleStartSkillExam} />
        )}

        {/* 2-Step Proctor Setup Modal */}
        {isSetupModalOpen && selectedSkillForExam && (
          <ProctorSetupModal
            skill={selectedSkillForExam}
            onReady={handleProctorReady}
            onCancel={() => {
              setIsSetupModalOpen(false);
              setSelectedSkillForExam(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export function App() {
  return (
    <TalentProvider>
      <ErrorBoundary fallbackTitle="Student Portal Recovered">
        <StudentAppContent />
      </ErrorBoundary>
    </TalentProvider>
  );
}

export default App;
