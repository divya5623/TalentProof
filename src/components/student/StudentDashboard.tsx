import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Edit2,
  Check,
  Search
} from 'lucide-react';
import { useTalent } from '../../context/TalentContext';
import { TOP_SKILLS } from '../../data/skillsData';
import type { Skill, Badge } from '../../types';
import { StudentCertificateModal } from './StudentCertificateModal';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface StudentDashboardProps {
  onStartExam: (skill: Skill) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onStartExam }) => {
  const { currentStudent, updateStudent } = useTalent();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(currentStudent.name);
  const [editedUni, setEditedUni] = useState(currentStudent.university);
  const [editedRole, setEditedRole] = useState(currentStudent.targetRole);
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedBadgeForCert, setSelectedBadgeForCert] = useState<Badge | null>(null);

  const handleSaveProfile = () => {
    updateStudent({
      name: editedName,
      university: editedUni,
      targetRole: editedRole,
    });
    setIsEditingProfile(false);
  };

  const filteredSkills = TOP_SKILLS.filter(skill => {
    const term = skillSearch.toLowerCase();
    return (
      skill.title.toLowerCase().includes(term) ||
      skill.category.toLowerCase().includes(term) ||
      skill.syllabus.some(s => s.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            <div className="relative">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-trust-200 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 bg-trust-500 text-white p-1 rounded-full border-2 border-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              {isEditingProfile ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-lg font-bold text-slate-900 border border-slate-300 rounded px-2 py-1 w-full"
                    placeholder="Your Name"
                  />
                  <input
                    type="text"
                    value={editedUni}
                    onChange={(e) => setEditedUni(e.target.value)}
                    className="text-xs text-slate-600 border border-slate-300 rounded px-2 py-1 w-full"
                    placeholder="University"
                  />
                  <input
                    type="text"
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="text-xs text-slate-600 border border-slate-300 rounded px-2 py-1 w-full"
                    placeholder="Target Role"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-trust-600 text-white text-xs font-semibold rounded hover:bg-trust-700"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{currentStudent.name}</h2>
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs sm:text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <span>{currentStudent.university}</span>
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="font-medium text-slate-500">{currentStudent.graduationYear}</span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <a
                      href={`https://github.com/${currentStudent.githubHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>{currentStudent.githubHandle}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Targeting: <span className="font-medium text-slate-700">{currentStudent.targetRole}</span></p>
                </>
              )}
            </div>
          </div>

          {/* Badges Earned Stat Badge */}
          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200/80 px-5 py-4 rounded-xl w-full sm:w-auto justify-between sm:justify-start">
            <div className="w-12 h-12 rounded-xl bg-trust-100/70 text-trust-700 flex items-center justify-center">
              <Award className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none">
                {currentStudent.earnedBadges.length} <span className="text-sm font-normal text-slate-500">/ 10</span>
              </div>
              <p className="text-xs font-semibold text-trust-700 mt-1 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified Badges Earned</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Filter for Skills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-slate-900">Top 10 In-Demand Skill Tracks</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
              Verified Protocol
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select any track to undergo real-time biometric proctoring and code evaluation.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            placeholder="Search skills or syllabus..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-trust-500/20 focus:border-trust-500 transition-all"
          />
        </div>
      </div>

      {/* 10 Skill Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => {
          const earnedBadge = currentStudent.earnedBadges.find(b => b.skillId === skill.id);

          return (
            <div
              key={skill.id}
              className={`bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ${
                earnedBadge
                  ? 'border-trust-300 shadow-sm bg-gradient-to-b from-white to-trust-50/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-card-hover'
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {skill.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {skill.difficulty}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center space-x-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{skill.duration}</span>
                    </span>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                  {skill.title}
                </h4>

                {/* Syllabus List */}
                <div className="mt-4 space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Audited Syllabus
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {skill.syllabus.map((topic, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-trust-500 font-bold text-xs leading-none mt-0.5">•</span>
                        <span className="line-clamp-1">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button / Earned Pill */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {earnedBadge ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-trust-50 border border-trust-200 text-trust-800 px-3.5 py-2 rounded-xl text-xs font-semibold">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-trust-600" />
                        <span>Verified Badge Earned</span>
                      </div>
                      <span className="text-[11px] font-mono text-trust-700 font-bold">
                        {earnedBadge.overallScore}% Score
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={() => setSelectedBadgeForCert(earnedBadge)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1"
                      >
                        <ShieldCheck className="w-3 h-3 text-trust-400" />
                        <span>View Certificate</span>
                      </button>
                      <button
                        onClick={() => onStartExam(skill)}
                        className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition-colors"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => onStartExam(skill)}
                    className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-trust-600 text-white text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start Secured Examination</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Modal */}
      {selectedBadgeForCert && (
        <StudentCertificateModal
          student={currentStudent}
          badge={selectedBadgeForCert}
          onClose={() => setSelectedBadgeForCert(null)}
        />
      )}
    </div>
  );
};
