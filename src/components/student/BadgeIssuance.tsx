import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Copy,
  ArrowRight,
  Fingerprint,
  Cpu,
  FileCheck2,
  Check,
  Printer
} from 'lucide-react';
import type { Badge, ProctorLog } from '../../types';
import { useTalent } from '../../context/TalentContext';
import { playSuccessChime } from '../../utils/audio';
import { StudentCertificateModal } from './StudentCertificateModal';

interface BadgeIssuanceProps {
  badge: Badge;
  proctorLog: ProctorLog;
  testsPassed: number;
  totalTests: number;
  onReturnDashboard: () => void;
}

export const BadgeIssuance: React.FC<BadgeIssuanceProps> = ({
  badge,
  proctorLog,
  testsPassed,
  totalTests,
  onReturnDashboard,
}) => {
  const { currentStudent } = useTalent();
  const [copiedHash, setCopiedHash] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    // Play celebratory audio chime
    playSuccessChime();

    // Trigger canvas confetti celebration
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#059669', '#10B981', '#34D399', '#2563EB', '#60A5FA'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(badge.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-elevated text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-trust-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Large Trust Emerald Shield Graphic */}
        <div className="relative mx-auto mb-6 flex flex-col items-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-trust-500 via-trust-600 to-emerald-700 flex items-center justify-center text-white shadow-xl shadow-trust-600/20 transform hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.8]" />
            <div className="absolute -bottom-2 -right-2 bg-slate-900 border-2 border-white rounded-full p-1.5 shadow-md">
              <Award className="w-5 h-5 text-trust-400" />
            </div>
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-trust-50 border border-trust-200 text-trust-800 text-xs font-bold tracking-wide uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-trust-600" />
              <span>Cryptographically Verified Credential</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Trust Badge Issued: {badge.skillTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
            Your identity, webcam biometric stream, and automated code test execution have been cryptographically verified and anchored with an immutable proof.
          </p>
        </div>

        {/* Comprehensive Score Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 text-left max-w-2xl mx-auto">
          {/* Technical Score */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
              <Cpu className="w-4 h-4 text-primary-600" />
              <span>Technical Problem Solving</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{badge.technicalScore}%</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Architecture scenario quiz & bug resolution
            </p>
          </div>

          {/* Test Pass Rate */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
              <FileCheck2 className="w-4 h-4 text-trust-600" />
              <span>Automated Test Pass Rate</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {testsPassed}/{totalTests} Passed
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Normal, boundary, and stress tests verified
            </p>
          </div>

          {/* Proctor Integrity */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold mb-1">
              <Fingerprint className="w-4 h-4 text-trust-600" />
              <span>Proctor Integrity</span>
            </div>
            <div className="text-2xl font-black text-trust-700">{proctorLog.integrityScore}%</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {proctorLog.tabSwitches} switches, {proctorLog.clipboardAnomalies} paste traps
            </p>
          </div>
        </div>

        {/* Cryptographic Ledger Proof Box */}
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 max-w-2xl mx-auto text-left space-y-3 font-mono text-xs border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
            <span>ZERO-TRUST IMMUTABLE AUDIT RECEIPT</span>
            <span className="text-trust-400 font-bold">{badge.verifiedBy}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400">Badge Unique ID:</span>
            <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {badge.id}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">SHA-256 Ledger Proof:</span>
              <button
                onClick={handleCopyHash}
                className="inline-flex items-center space-x-1 text-[11px] text-trust-400 hover:text-trust-300"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800 break-all text-[11px] text-slate-300 mt-1 font-mono select-all">
              {badge.sha256Hash}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Certified Engineer: {currentStudent.name}</span>
            <span>Issued: {new Date(badge.issuedAt).toLocaleTimeString()} UTC</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => setShowCertModal(true)}
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-trust-600 hover:bg-trust-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>View & Print Certificate</span>
          </button>

          <button
            onClick={onReturnDashboard}
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors border border-slate-200"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertModal && (
        <StudentCertificateModal
          student={currentStudent}
          badge={badge}
          proctorLog={proctorLog}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
};
