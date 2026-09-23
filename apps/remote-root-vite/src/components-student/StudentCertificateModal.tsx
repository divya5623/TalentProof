import React from 'react';
import type { CurrentStudent, Badge, ProctorLog } from '../../types';
import { ShieldCheck, Printer, X, Lock } from 'lucide-react';

interface StudentCertificateModalProps {
  student: CurrentStudent;
  badge: Badge;
  proctorLog?: ProctorLog;
  onClose: () => void;
}

export const StudentCertificateModal: React.FC<StudentCertificateModalProps> = ({
  student,
  badge,
  proctorLog,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const integrityScore = proctorLog ? proctorLog.integrityScore : badge.proctorScore;
  const tabSwitches = proctorLog ? proctorLog.tabSwitches : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-trust-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Official Skill Verification Certificate</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-trust-600 hover:bg-trust-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Document */}
        <div className="p-8 sm:p-12 space-y-8 bg-white" id="certificate-print-area">
          {/* Certificate Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 text-trust-700 font-extrabold text-xl">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                <span className="tracking-tight text-slate-900">TrustHire AI</span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                Zero-Trust Skill Verification Protocol • Official Certification
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-trust-50 text-trust-800 font-mono text-xs font-bold border border-trust-200">
                STATUS: VERIFIED AUTHENTIC
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-1">DOC ID: {badge.id}</p>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="text-center space-y-3 py-4">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">This certifies that</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{student.name}</h2>
            <p className="text-xs text-slate-600 font-medium">
              {student.university} • {student.graduationYear}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto pt-2">
              has completed the proctored Zero-Trust examination and demonstrated verified engineering competency in:
            </p>
            <div className="inline-block bg-trust-50 border border-trust-300 text-trust-900 px-5 py-2.5 rounded-xl font-bold text-base">
              {badge.skillTitle}
            </div>
          </div>

          {/* Audit Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 border-y border-slate-200 py-6 text-center text-xs">
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Overall Score</p>
              <p className="text-xl font-black text-slate-900 mt-1">{badge.overallScore}%</p>
              <p className="text-[10px] text-slate-500">Benchmark Evaluated</p>
            </div>
            <div className="border-x border-slate-200 px-2">
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Technical Score</p>
              <p className="text-xl font-black text-slate-900 mt-1">{badge.technicalScore}%</p>
              <p className="text-[10px] text-slate-500">Quiz + Sandbox Code</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Proctor Integrity</p>
              <p className="text-xl font-black text-trust-600 mt-1">{integrityScore}%</p>
              <p className="text-[10px] text-slate-500">
                {tabSwitches === 0 ? '0 Tab Switches' : `${tabSwitches} Tab Switches`}
              </p>
            </div>
          </div>

          {/* Cryptographic Hash Ledger Block */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-bold flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-trust-600" />
                <span>SHA-256 Ledger Audit Proof:</span>
              </span>
              <span>Algorithm: SHA-256-FIPS-180-4</span>
            </div>
            <p className="break-all text-[11px] text-slate-800 bg-white p-2 rounded border border-slate-200">
              {badge.sha256Hash}
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 flex items-end justify-between text-xs text-slate-600">
            <div>
              <div className="w-36 border-b border-slate-400 pb-1 font-mono text-[11px] text-slate-800 font-bold">
                {badge.verifiedBy}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Autonomous Verification Authority</p>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-slate-400 pb-1 font-mono text-[11px] text-slate-800 font-bold">
                {new Date(badge.issuedAt).toLocaleDateString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Verification Timestamp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
