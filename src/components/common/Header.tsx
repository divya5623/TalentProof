import React from 'react';
import { ShieldCheck, Radio, Award, RotateCcw } from 'lucide-react';
import { useTalent } from '../../context/TalentContext';

export const Header: React.FC = () => {
  const { currentStudent, resetAllData } = useTalent();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & System Tag */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-trust-50 border border-trust-200 flex items-center justify-center text-trust-600 shadow-sm">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-lg tracking-tight">TrustHire AI</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-trust-50 text-trust-700 border border-trust-200">
                ZERO-TRUST
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Student Skill Verification & Proctored Examination Suite
            </p>
          </div>
        </div>

        {/* Center: Live Proctor Network Health Pill */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-trust-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-trust-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-600">Proctor Network:</span>
          <span className="text-xs font-semibold text-trust-700">Operational</span>
          <Radio className="w-3.5 h-3.5 text-trust-600 ml-0.5" />
        </div>

        {/* Right Actions: Student Badges Counter & Reset */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-trust-50/70 border border-trust-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-trust-800">
            <Award className="w-4 h-4 text-trust-600" />
            <span>
              {currentStudent.earnedBadges.length} / 10 Badges Certified
            </span>
          </div>

          {/* Reset button for easy demo reset */}
          <button
            onClick={() => {
              if (window.confirm('Reset student session and earned badges to test again?')) {
                resetAllData();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Reset Student Session & Badges"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
